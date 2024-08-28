import { createClient } from 'redis';
import express from 'express';
import { promisify } from 'util';
import kue from 'kue';

const client = createClient();
client.on('error', (err) => console.error('Redis Client Error:', err));

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

const initialSeats = 50;
let reservationEnabled = true;

const reserveSeat = async (number) => {
  await setAsync('available_seats', number);
};

const getCurrentAvailableSeats = async () => {
  const seats = await getAsync('available_seats');
  return parseInt(seats, 10);
};

reserveSeat(initialSeats);

const app = express();
const queue = kue.createQueue();

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: seats });
});

app.get('/reserve_seat', (req, res) => {
  if (!reservationEnabled) {
    return res.json({ status: 'Reservation are blocked' });
  }

  const job = queue.create('reserve_seat').save((err) => {
    if (!err) {
      return res.json({ status: 'Reservation in process' });
    } else {
      return res.json({ status: 'Reservation failed' });
    }
  });
});

app.get('/process', async (req, res) => {
  res.json({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const seats = await getCurrentAvailableSeats();

    if (seats > 0) {
      const newSeats = seats - 1;
      await reserveSeat(newSeats);

      if (newSeats === 0) {
        reservationEnabled = false;
      }

      done();
    } else {
      done(new Error('Not enough seats available'));
    }
  });
});

app.listen(1245, () => {
  console.log('Server is running on port 1245');
});

queue.on('job complete', (id) => {
  console.log(`Seat reservation job ${id} completed`);
});

queue.on('job failed', (id, errorMessage) => {
  console.error(`Seat reservation job ${id} failed: ${errorMessage}`);
});
