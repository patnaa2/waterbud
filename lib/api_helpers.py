import datetime

def convert_datetime_to_epoch(dt):
    return int((dt - datetime.datetime(1970, 1, 1)).total_seconds()) * 1000

def pad_data_with_zeroes(data, start, end, table_type="daily"):
    '''
        This is beyond a shitty hack, my god. Welp.
        In the requested time range, if the data doesnt exist
        for a certain expected range, input a data point with 0
    '''
    if table_type == "daily":
        expected_points = (end-start).days + 1
    else:
        expected_points = int((end - start).total_seconds() / 3600) + 1

    # short circuit condition
    if expected_points == len(data):
        return sorted(data, key = lambda x: x[0])
    
    if table_type == "daily":
        expected = set([ start + datetime.timedelta(days=i) 
                            for i in xrange(expected_points)])
    else:
        expected = set([ start + datetime.timedelta(seconds=i*3600) 
                            for i in xrange(expected_points)])

    current = set([x[0] for x in data])
    
    for missing in expected - current:
        data.append([missing, 0])
    
    return sorted(data, key = lambda x: x[0])
