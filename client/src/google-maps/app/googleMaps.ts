/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../controller/googlemapsctrl.ts" />
/// <reference path="../directive/googlemapsdrt.ts" />
/// <reference path="../../global/app/global.ts" />
module googleMaps {
    angular.module('googleMaps', ['global'])
        .controller('GoogleMapsCtrl', GoogleMapsCtrl)
        .directive('googleMaps', googleMapsDrt);
}