#!/usr/bin/env python3
"""0. Simple helper function"""


def index_range(page, page_size):
    """ takes two integer arguments page and page_size
        return a tuple of size two containing a start
        index and an end index corresponding to the range
        of indexes to return in a list for those particular
        pagination parameters.
    """
    return ((page - 1) * page_size, (page - 1) * page_size + page_size)