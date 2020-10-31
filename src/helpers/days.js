const moment = require('moment');

const weekRoutineDays = [];
weekRoutineDays.push({ numberDay : 1, name : 'Monday',})
weekRoutineDays.push({ numberDay : 2, name : 'Tuesday',})
weekRoutineDays.push({ numberDay : 3, name : 'Wednesday',})
weekRoutineDays.push({ numberDay : 4, name : 'Thursday',})
weekRoutineDays.push({ numberDay : 5, name : 'Friday',})
weekRoutineDays.push({ numberDay : 6, name : 'Saturday',})
weekRoutineDays.push({ numberDay : 7, name : 'Sunday',})

// module.exports = weekRoutineDays;

const timeCompare = (time1,time2)  => 
{
    var t1 = new Date();
    var parts = time1.split(":");
    t1.setHours(parts[0],parts[1],parts[2],0);
    var t2 = new Date();
    parts = time2.split(":");
    t2.setHours(parts[0],parts[1],parts[2],0);
  
    // returns 1 if greater, -1 if less and 0 if the same
    if (t1.getTime()>t2.getTime()) return 1;
    if (t1.getTime()<t2.getTime()) return -1;
    return 0;
};

const isTimeBetween = (startTime, endTime, timeToCheck) =>
{
    let start = moment(startTime, "H:mm")
    let end = moment(endTime, "H:mm")
    let time = moment(timeToCheck, "H:mm")
    if (end < start) {
        return time >= start && time<= moment('23:59:59', "h:mm:ss") || time>= moment('0:00:00', "h:mm:ss") && time < end;
    }
    return time>= start && time<= end
}

module.exports = 
{
    weekRoutineDays: weekRoutineDays,
    timeCompare : timeCompare,
    isTimeBetween : isTimeBetween,
}