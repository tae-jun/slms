var groups = require('../../lib/mongo/groups');
var lights = require('../../lib/mongo/lights');

describe('Collection groups', function () {
    var testGroup;

    it('should be connected to mongodb', function (done) {
        if (groups.isConnected)
            done();
        else
            groups.done = done;
    });

    it('should create a doc', function (done) {
        testGroup = new groups.Group();
        testGroup.name = 'test group';

        groups.create(testGroup, function (result) {
            expect(result._id).toBeDefined();
            testGroup = result;
            done();
        });
    });

    it('should find a group', function (done) {
        groups.findByID(testGroup._id, function (item) {
            expect(item).toEqual(testGroup);
            done();
        });
    });

    it('should find all groups', function (done) {
        groups.findAll(function (items) {
            expect(items.length).toBeGreaterThan(0);
            expect(items).toContain(testGroup);
            done();
        });
    });

    it('should update a group', function (done) {
        groups.update(testGroup._id, { name: 'changed' }, function (result) {
            expect(result).toBe(1);

            groups.findByID(testGroup._id, function (item) {
                expect(item.name).toBe('changed');
                testGroup = item;
                done();
            });
        });
    });

    describe('Function remove', function () {
        var testLightsNum = 5;
        var testLights;

        it('create test lights', function (done) {
            testLights = new Array(testLightsNum);
            for (var i = 0; i < testLightsNum; i++) {
                testLights[i] = new lights.Light();
                testLights[i].name = 'test light ' + i;
                testLights[i].groupID = testGroup._id;
            }

            var count = 0;
            for (var i = 0; i < testLightsNum; i++) {
                lights.create(testLights[i], function (result) {
                    testLights[i] = result;
                    count++;
                    if (count == testLightsNum)
                        done();
                });
            }
        });

        it('should update groupID of lights of group', function (done) {
            groups.remove(testGroup._id, function (result) {
                expect(result.lights).toBe(testLightsNum);
                expect(result.groups).toBe(1);
                done();
            });
        });

        it('remove test lights', function (done) {
            var count = 0;
            for (var i = 0; i < testLightsNum; i++) {
                lights.remove(testLights[i]._id, function (num) {
                    count++;
                    if (count == testLightsNum)
                        done();
                });
            }
        });
    });
});
