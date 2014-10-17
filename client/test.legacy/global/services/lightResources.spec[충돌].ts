/// <reference path="../../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../../typings/angularjs/angular-mocks.d.ts" />
/// <reference path="../../../typings/angularjs/angular-resource.d.ts" />
/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../src/global/services/lightresource.ts" />

describe('light resource test', () => {

    var $httpBackend: ng.IHttpBackendService;
    var lightResource: global.lightResource;

    beforeEach(module('global'));
    beforeEach(module('ngMockE2E'));
    
    beforeEach(inject(($injector) => {
        $httpBackend = $injector.get('$httpBackend');
        lightResource = $injector.get('lightResource');
        $httpBackend.whenGET('http://localhost/db/lights').passThrough();
    }));
    
    it('should provide light resource', (done) => {
        var lights = lightResource.query(() => {
            console.log(lights);
            done();
        });
        $httpBackend.flush();
        console.log(lights);
    });
});