#!/usr/bin/python3
"""3. LRU Caching"""
from base_caching import BaseCaching
from collections import OrderedDict


class LRUCache(BaseCaching):
    """class LRUCache that inherits from BaseCaching
    and is a caching system"""

    def __init__(self):
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """assign to the dictionary self.cache_data the
        item value for the key key"""
        if key and item:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                removed = self.cache_data.popitem(last=False)
                print("DISCARD: {}".format(removed[0]))
            self.cache_data[key] = item

    def get(self, key):
        """return the value in self.cache_data linked to key"""
        if key and key in self.cache_data:
            return self.cache_data[key]
        return None
