import datetime

def convert_datetime_to_epoch(dt):
    return int((dt - datetime.datetime(1970, 1, 1)).total_seconds())
