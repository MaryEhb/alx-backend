import { createQueue } from 'kue';

const job_data = { phoneNumber: 'string', message: 'string' };

const queue = createQueue({ name: 'push_notification_code' });
const job = queue.create('push_notification_code', job_data);

job.on('enqueue', () => {
  console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => {
  console.log('Notification job completed');
});

job.on('failed attempt', () => {
  console.log('Notification job failed');
});

job.save();
