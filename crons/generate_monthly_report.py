from __future__ import division
import datetime
import pymongo

PRICE_PER_LITRE = 1.51 / 1000
SPENDING_LIMIT = 190 

db = pymongo.MongoClient()['test']

def report_total_monthly_usage(month):
    start = datetime.datetime.strptime(month, "%Y/%m").replace(day=1, 
                                                               hour=0,
                                                               minute=0,
                                                               second=0,
                                                               microsecond=0)
    end = start.replace(month=start.month + 1)
    
    res = db['total_by_day'].find({"timestamp": 
                                        {"$lt": end, "$gte": start}})
    total_consumption = sum(x["flow_ml"]/1000 for x in res)
    spent = total_consumption * PRICE_PER_LITRE 
    
    data = {"month" : start, 
            "limit" : SPENDING_LIMIT,
            "current_spending" : spent}

    db['monthly_summary'].insert_one(data)

if __name__ == "__main__":
    months = ["2016/04", "2016/05", "2016/06", "2016/07"]

    for mon in months:
        print "processing month: %s" %(mon)
        report_total_monthly_usage(mon)
