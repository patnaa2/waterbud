import datetime

def convert_datetime_to_epoch(dt):
    return int((dt - datetime.datetime(1970, 1, 1)).total_seconds()) * 1000

def pad_data_with_zeroes_d(data, start, end):
    '''
        This is beyond a shitty hack, my god. Welp.
        In the requested time range, if the data doesnt exist
        for a certain expected range, input a data point with 0

        Too lazy to do switching between daily and hourly, so have
        two seperate functions for now.
    '''


