"""
    Backflow data generation.
"""
from __future__ import division
import datetime as dt
import random
import json

import numpy as np


def single_day(year, month, day):
    """
        Generates restroom, kitchen, garden consumption data on a per second
        basis, for a specified day.

        Parameters
        ----------
        year : {int}

        month : {int}

        day : {int}
    """
    # fixed instantaneous consumption (ml)
    rate = 21 

    # occurences
    restroom = (8, 12)
    kitchen = (10, 15)
    garden = (0,1)

    # timings
    restroom_t = [(7, 9), (12, 15), (18,21)]
    kitchen_t = [(7, 23)]
    garden_t = [(18, 21)]

    # duration (number of 'second' data points)
    restroom_d = (30,60) 
    kitchen_d = (30,60)
    garden_d = (1800, 2700)

    # iterate over timings and generate random occurences
    restroom_o = np.random.randint(restroom[0], restroom[1]+1)
    kitchen_o = np.random.randint(kitchen[0], kitchen[1]+1)
    garden_o = np.random.randint(garden[0], garden[1]+1)

    # generate occurences for each time interval
    def gen_time_occurences(timings, occurences):
        to = []
        occ = occurences

        for idx, interval in enumerate(timings):
            if idx == len(timings) - 1 or occ == 0 or occ == 1:
                to.append(occ)
                continue
            gen = np.random.randint(1, occ)
            to.append(gen)
            occ -= gen

        return zip(timings, to)

    # time-occurence mapping
    restroom_to = gen_time_occurences(restroom_t, restroom_o)
    kitchen_to = gen_time_occurences(kitchen_t, kitchen_o)
    garden_to = gen_time_occurences(garden_t, garden_o)

    # generate timeseries data points
    # each data point corresponds to the number of seconds from 0
    def gen_timeseries(to_map, duration):
        ts = []
        # create points between lower and upper t based on # of occurences
        for mapping in to_map:
            interval, occ = mapping

            if occ == 0:
                continue

            difference = (interval[1] - interval[0])*60*60
            lower_stamp = 0
            tstamps = []

            for num in xrange(0, occ):
                stamp = np.random.randint(lower_stamp, difference)
                tstamps.append(interval[0]*60*60 + stamp)
                lower_stamp = stamp

            # obtained timestamps for a given interval
            # generate duration
            dur = np.random.randint(duration[0], duration[1])

            # convert interval from hours to seconds (convenience)
            conv_interval = map(lambda x: x*60*60, interval)

            range_storage = []

            for idx, stamp in enumerate(tstamps):
                # handle last timestamp with duration greater than upper bound
                if idx == len(tstamps) - 1 and stamp + dur >= conv_interval[1]:
                    range_storage.append(np.arange(stamp, conv_interval[1], 1))
                    continue
                elif idx < len(tstamps) -1 and stamp + dur >= tstamps[idx+1]:
                    range_storage.append(np.arange(stamp, tstamps[idx+1], 1))
                    continue

                range_storage.append(np.arange(stamp, stamp+dur, 1))

            ts.append((interval,range_storage))

        return ts

    # timeseries retrieval (integer data points - seconds)
    restroom_ts = gen_timeseries(restroom_to, restroom_d)
    kitchen_ts = gen_timeseries(kitchen_to, kitchen_d)
    garden_ts = gen_timeseries(garden_to, garden_d)

    # convert seconds data into timestamps
    def convert_seconds(ts_map):
        conv_ts = []

        for interval, ts in ts_map:
            # generate base
            base = dt.datetime(year, month, day, interval[0])
            # compute delta for each point
            delta = [[dt.timedelta(seconds=val-interval[0]*60*60) 
                      for val in series] for series in ts] 

            # add delta to base and create datetime points
            modified_base = [[base + dlt for dlt in series] for series in delta]

            # strftime conversion - uncomment if necessary
            modified_base = [[pt.strftime("%Y-%m-%d %H:%M:%S") for pt in series]
                             for series in modified_base]

            conv_ts.append(modified_base)

        return conv_ts

    # converted timeseries
    restroom_cts = convert_seconds(restroom_ts)
    kitchen_cts = convert_seconds(kitchen_ts)
    garden_cts = convert_seconds(garden_ts)

    # flatten list twice and generate single list of timestamps
    restroom_flat = sum([sum(arr, []) for arr in restroom_cts], [])
    kitchen_flat = sum([sum(arr, []) for arr in kitchen_cts], [])
    garden_flat = sum([sum(arr, []) for arr in garden_cts], [])

    result = {"restroom": [(stamp, rate) for stamp in restroom_flat],
              "kitchen": [(stamp, rate) for stamp in kitchen_flat],
              "garden": [(stamp, rate) for stamp in garden_flat]}

    return json.dumps(result)


def generate():
    """
        TODO: Generate data for previous month.
    """
    return None


if __name__ == '__main__':
    single_day(2016, 07, 01)
