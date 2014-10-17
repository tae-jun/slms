describe('light resource test', function () {
    var lightResource;

    beforeEach(function () {
        var injector = angular.injector(['global']);

        lightResource = injector.get('lightResource');
        console.log(lightResource);
    });

    it('light Resource', function (done) {
        lightResource.query(function (lights) {
            console.log(lights);
            done();
        });
    });
});
//# sourceMappingURL=lightResources.spec.js.map
