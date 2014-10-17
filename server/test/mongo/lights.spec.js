var lights = require('../../lib/mongo/lights');

describe('Collection lights spec', function () {
    var testLight;

    it('should connect to mongodb before test', function (done) {
        if (lights.isConnected)
            done();
        else
            lights.done = done;
    });

    it('should create one document of light', function (done) {
        var light = new lights.Light();
        light.name = 'test light';
        light.lat = 12;
        light.lng = 123;

        lights.create(light, function (result) {
            testLight = result;
            expect(testLight._id).toBeDefined();
            done();
        });
    });

    it('should find light just created', function (done) {
        lights.findByID(testLight._id, function (item) {
            expect(item).toEqual(testLight);
            done();
        });
    });

    it('should find all lights', function (done) {
        lights.findAll(function (items) {
            expect(items.length).toBeGreaterThan(0);
            expect(items).toContain(testLight);
            done();
        });
    });

    it('should update light just found', function (done) {
        testLight.name = 'changed';

        lights.update(testLight._id, { name: testLight.name }, function (result) {
            expect(result).toBe(1);
            done();
        });
    });

    it('should remove light just updated', function (done) {
        lights.remove(testLight._id, function (numOfRemoved) {
            expect(numOfRemoved).toBe(1);
            done();
        });
    });
});
