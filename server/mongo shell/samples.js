use main;

// random function
var random = function(max){
    if(typeof max != 'number')
        max = 1;
    return Math.round(Math.random() * max);
};

// drop
db.schedulers.drop();
db.groups.drop();
db.lights.drop();

// create test data
var schedulers = [];
var groups = [];
var lights = [];

// max numbers
var schedulerNum = 5;
var eventNum = 10;
var groupNum = 5;
var lightNum = 10;

// create schedulers
for (var i = 0; i < schedulerNum; i++) {
    // insert new scheduler
    db.schedulers.insert({
        name: '계획 ' + i
    });
}

schedulers = db.schedulers.find().toArray();

var groupCount = 1;

// create groups
schedulers.forEach(function(scheduler){
    var max = random(groupNum);

    for (var i = 0; i < max; i++) {
        db.groups.insert({
            name: '그룹 ' + groupCount,
            sid: scheduler._id,
            rgb: [random(255), random(255), random(255)],
            did: groupCount     // device id
        });
        groupCount++;
    }
});

groups = db.groups.find().toArray();

// create lights
// in group
groups.forEach(function (group) {
    var max = Math.random() * lightNum;
    for (var i = 0; i < max; i++) {
        db.lights.insert({
            name: group.name + ' 가로등 ' + i,
            lat: Math.random() * 0.05 + 37.657912,
            lng: Math.random() * 0.05 + 126.7723187,
            gid: group._id,
            rgb: [random(255), random(255), random(255)]
        });
    }
});
// no group
for (var i = 0; i < Math.random() * lightNum + 1; i++) {
    db.lights.insert({
        name: '그룹이 없는 가로등 ' + i,
        lat: Math.random() * 0.01 + 37.657912,
        lng: Math.random() * 0.01 + 126.7723187,
        gid: null
    });
}

db.lights.count();
db.groups.count();
db.schedulers.count();

// update daily events
for(var i = 0; i < schedulers.length; i++){
    // create daily events
    var daily = [];

    for(var j = 0; j < random(eventNum); j++){
        var ev = {
            h: random(23),      // 0 ~ 23
            m: random(59),      // 0 ~ 59
            rgb: [random(255), random(255), random(255)]
        };
        daily.push(ev);
    }

    // push daily events
    db.schedulers.update(
        { _id: schedulers[i]._id }, 
        { $push: {
            daily: {
                $each: daily,
                $sort: { h: 1, m: 1 }
            }
        }});
}

schedulers = db.schedulers.find().toArray();

db.lights.findOne();
