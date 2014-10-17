/// <reference path="../common/controllers/googlemapsctrl.ts" />
/// <reference path="../common/directives/googlemapsdirec.ts" />
/// <reference path="../../application/app/application.ts" />
module googleMaps {
    angular.module('googleMaps', ['application'])
        .directive('googleMaps', directive)
        .controller('googleMapsCtrl', controller);
}