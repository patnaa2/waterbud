"""
    Backflow data generation.

    Location Structure
    ------------------
    - occurences: {tuple}
        upper and lower bound of event occurences per day
    - timings: {list of tuples}
        sets of time intervals during which an event would take place
    - duration: {tuple}
        amount of time taken for a single event (minutes)
    - rate: {float}
        ml value for consumption on a per-minute basis
"""
from __future__ import division
from itertools import groupby
import datetime as dt
import random
import json

import numpy as np
import pymongo

# location data store
locations = {
    "bathroom_sink":{
        "occurences": (8,12),
        "timings": [(7,9), (12,15), (18,21)],
        "duration": (1, 3),
        "rate": 7003
    },
    "kitchen_sink":{
        "occurences":(10,15),
        "timings": [(7,23)],
        "duration": (1, 5),
        "rate": 7003
    },
    "garden":{
        "occurences": (0, 1),
        "timings": [(18,21)],
        "duration": (30, 90), 
        "rate": 94635 # 25-foot hose, 40psi, 24gpm
    },
    "shower":{
        "occurences": (0, 1), 
        "timings": [(7,9), (18,20)],
        "duration": (17, 18),
        "rate": 9464 # 2.5 gpm
    }
}

# make db connection global
db = pymongo.MongoClient('localhost', 27017)['waterbud']

# HELPERS
def gen_time_occurences(timings, occurences):
    """
        Map occurences to time intervals per location. The sum of occurences
        per time interval should correspond to the number of occurences
        listed in the location data store.

        Parameters
        ----------
        timings : {list}
            list of time intervals

        occurences : {int}
            total number of occurences for a given location
    """
    to = []
    occ = occurences

    for idx, interval in enumerate(timings):
        if idx == len(timings) - 1 or occ == 0:
            to.append(occ)
            continue
        gen = np.random.randint(0, occ)
        to.append(gen)
        occ -= gen

    return zip(timings, to)


def gen_timeseries(to_map, duration):
    """
        Generate data points (minutes) based on the number of occurences
        for a given time interval. A single data point corresponds to the
        total number of minutes from 0 (i.e. 12AM on a given day).

        Parameters
        ----------
        to_map : {list of tuples}
            time-occurence mapping obtained from gen_time_occurences().
            each tuple should have the following format
            (time_interval, occurences)

        duration : {tuple}
            tuple denoting the upper and lower bounds for a single event
            duration (i.e. specified duration bounds are used for all 
            occurences)
    """
    ts = []

    # create points between lower and upper t based on # of occurences
    for interval, occ in to_map:
        if occ == 0:
            continue

        difference = (interval[1] - interval[0])*60
        lower_stamp = 0
        tstamps = []

        for num in xrange(0, occ):
            stamp = np.random.randint(lower_stamp, difference+1)
            tstamps.append(interval[0]*60 + stamp)
            lower_stamp = stamp

        # required: handle duplicate timestamps
        num_duplicates = len(tstamps) - len(set(tstamps))

        # continuously generate timestamps
        while num_duplicates > 0:
            additional_occurences = []
            distance = 1
            while len(additional_occurences) < num_duplicates:
                additional_occurences += \
                [stamp+distance for stamp in set(tstamps)]
                additional_occurences = \
                    [occ for occ in additional_occurences if occ not in tstamps]
                distance += 1
            tstamps = list(set(tstamps)) + \
                additional_occurences[:num_duplicates]
            num_duplicates = len(tstamps) - len(set(tstamps))

        # sort tstamps
        tstamps.sort()

        # generate duration
        dur = np.random.randint(duration[0], duration[1]+1)

        # convert interval from hours to minutes (convenience)
        conv_interval = map(lambda x: x*60, interval)

        range_storage = []

        # generate range of timestamp data points based on generated duration
        for idx, stamp in enumerate(tstamps):
            # handle last timestamp with duration greater than upper bound
            if idx == len(tstamps) - 1 and stamp + dur >= conv_interval[1]:
                range_storage.append(np.arange(stamp, conv_interval[1]+1, 1))
                continue
            elif idx < len(tstamps) - 1 and stamp + dur >= tstamps[idx+1]:
                range_storage.append(np.arange(stamp, tstamps[idx+1], 1))
                continue
            range_storage.append(np.arange(stamp, stamp+dur, 1))

        ts.append((interval,range_storage))

    return ts


def convert_minutes(ts_map, **kwargs):
    """
        Convert numeric minutes in passed timeseries to datetime string
        representation.

        Parameters
        ----------
        ts_map : {list of tuples}
            list of tuples corresponding to an event interval and a list of
            occurence timestamps.

        Keyword Arguments
        -----------------
        year, month, day : {int}
            corresponds to year, month, and day of base timestamp
    """
    conv_ts = []

    for interval, ts in ts_map:
        base = dt.datetime(kwargs["year"], kwargs["month"], kwargs["day"], 
                           interval[0])

        # compute delta for each point
        delta = [[dt.timedelta(minutes=val-interval[0]*60) 
                  for val in series] for series in ts] 

        # add delta to base and create datetime points
        modified_base = [[base + dlt for dlt in series] for series in delta]

        # strftime conversion
        modified_base = [[pt for pt in series]
                         for series in modified_base]

        conv_ts.append(modified_base)

    return conv_ts


# PRIMARY METHODS
def single_day(year, month, day):
    """
        Generates location consumption data on a per minute basis, for a 
        specified day.

        Parameters
        ----------
        year : {int}
        month : {int}
        day : {int}
    """
    result = {}

    for location, data in locations.iteritems():
        occ = data["occurences"]
        timings = data["timings"]
        dur = data["duration"]

        # generate occurences
        occurences = np.random.randint(occ[0], occ[1]+1)

        # never allow 0 occurences - set to upper bound
        occurences = occ[1] if occurences == 0 else occurences

        # map occurences to time intervals
        to_map = gen_time_occurences(timings, occurences)

        # pdb.set_trace()

        # generate timeseries data
        ts_map = gen_timeseries(to_map, dur)

        # convert timeseries data
        conv_ts = convert_minutes(ts_map, year=year, month=month, day=day)

        # double flattening of converted timeseries to generate single list
        flat = sum([sum(arr, []) for arr in conv_ts], [])

        # map rate to each timestamp
        result[location] = [(stamp, data["rate"]) for stamp in flat]

    return result


def generate(n):
    """
        Generate data for previous n days.
        
        Parameters
        ----------
        n : {int}
            number of days for which historical data will be generated. upper
            bound is one day prior to date of instantiation.
    """
    init_day = dt.date.today() - dt.timedelta(days=1)

    # fixed number of days for which we want historical data => n
    init_day -= dt.timedelta(days=n)

    dates = []

    for num in xrange(1, n+1):
        dates.append(init_day + dt.timedelta(days=num))

    data = [single_day(date.year, date.month, date.day) for date in dates]
    
    # upload to db
    n = len(data)
    for i in xrange(n):
        day = data[i]
        print "Processing Day %s / %s" %(i, n) 
        for sensor, gen_data in day.iteritems():
            fill_minute_coll(gen_data, sensor)
            fill_hourly_coll(gen_data, sensor)
        # now we process the total tables
        # collapse the dict into one single value of total values
        flat_day = [ item for sublist in day.itervalues() for item in sublist ]
        total_data = []
        for k, v in groupby(flat_day, 
                            lambda x: x[0].minute):
            vals = list(v)
            total_data.append((vals[0][0], sum(x[1] for x in vals)))
        
        # fill total data
        fill_minute_coll(total_data, 'total')
        fill_hourly_coll(total_data, 'total')
        
    print "Finished processing data"


def fill_minute_coll(data, location):
    '''
        inserts data into minute table
        take in fake data per minute for one day
    '''
    data = [{"timestamp": x[0], "flow_ml" : x[1]} for x in data]
    db['%s_by_minute' %(location)].insert_many(data)


def fill_hourly_coll(data, location):
    '''
        inserts data into hourly table
        take in fake data per minute for one day
    '''
    # another shitty hack to keep track of the date to keep the groupby logic
    # clean --> store the current date and then rebuild the timestamp from 
    # there, remove minute/second resolution here
    current_date = data[0][0]
    
    data = [(current_date.replace(hour=k, minute=0, second=0, microsecond=0), 
                sum(x[1] for x in v)) 
            for k, v in groupby(data, key=lambda x: x[0].hour)]

    # Hack: Anshuman 07/17:: hourly has all the required data for daily table
    # so call it here to fill the daily_collection table
    db_data = [{"timestamp": x[0], "flow_ml": x[1]} for x in data]
    db['%s_by_hour' %(location)].insert_many(db_data)
    fill_daily_coll(data, location)


def fill_daily_coll(data, location):
    '''
        inserts data into a daily table
        take in fake data per hour for one day 
    '''
    # just sum all the data points, gauranteed to only get one data point
    data = {"timestamp" : data[0][0].replace(hour=0, minute=0, 
                                             second=0, microsecond=0), 
            "flow_ml": sum(x[1] for x in data)}
    db['%s_by_day' %(location)].insert_one(data)


if __name__ == '__main__':
    generate(100)
