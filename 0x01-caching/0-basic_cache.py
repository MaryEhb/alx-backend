#!/usr/bin/python3
"""0. Basic dictionary"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """a class BasicCache that inherits from
    BaseCaching and is a caching system"""

    def put(self, key, item):
        """add cache to cache dict"""
        if key and item:
            self.cache_data[key] = item

    def get(self, key):
        """return the value in self.cache_data linked to key"""
        if key and key in self.cache_data:
            return self.cache_data[key]
