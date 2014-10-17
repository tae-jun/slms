var application;
(function (application) {
    function appCtrl($scope, lightsSrvc) {
        $scope.scopeName = 'appCtrl';
    }
    application.appCtrl = appCtrl;
})(application || (application = {}));
var application;
(function (application) {
    application.config = {
        resource: {
            lights: 'http://localhost/db/lights'
        },
        sideBar: {
            templateUrl: 'static/side-bar.tpl.html'
        }
    };
})(application || (application = {}));
/// <reference path="../../../config.ts" />
var application;
(function (application) {
    function lightsSrvc($resource) {
        var lights;
        lights = $resource(application.config.resource.lights);
        return lights;
    }
    application.lightsSrvc = lightsSrvc;
})(application || (application = {}));
/// <reference path="../common/controllers/appctrl.ts" />
/// <reference path="../common/services/lightssrvc.ts" />
var application;
(function (application) {
    angular.module('application', ['ngResource']).factory('lightsSrvc', application.lightsSrvc).controller('appCtrl', application.appCtrl);
})(application || (application = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var googleMaps;
(function (googleMaps) {
    var gMaps = google.maps;

    function controller($scope, lightsSrvc) {
        $scope.scopeName = 'googleMaps scope';

        var mapOptions = {
            center: new gMaps.LatLng(37.6440844, 126.7868542),
            zoom: 15,
            mapTypeId: gMaps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        $scope.map = new gMaps.Map(document.getElementById('map_canvas'), mapOptions);

        // set location to my current location
        navigator.geolocation.getCurrentPosition(function (position) {
            var myPosition = new gMaps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.map.setCenter(myPosition);
        });

        $scope.markers = new Array();

        var lights = lightsSrvc.query(function () {
            for (var i = 0; i < lights.length; i++) {
                var light = lights[i];
                console.log(light);
                var markerOption = {
                    title: light.name,
                    position: new gMaps.LatLng(light.lat, light.lng),
                    map: $scope.map
                };
                $scope.markers.push(new gMapMarker(markerOption));
            }
        });
    }
    googleMaps.controller = controller;

    var gMapMarker = (function (_super) {
        __extends(gMapMarker, _super);
        function gMapMarker(markerOptions) {
            _super.call(this, markerOptions);
            this.markerOptions = markerOptions;
        }
        return gMapMarker;
    })(gMaps.Marker);
    googleMaps.gMapMarker = gMapMarker;
})(googleMaps || (googleMaps = {}));
var googleMaps;
(function (googleMaps) {
    function directive() {
        return {
            restrict: 'E',
            template: '<div id="map_canvas" ng-controller="googleMapsCtrl"></div>'
        };
    }
    googleMaps.directive = directive;
})(googleMaps || (googleMaps = {}));
/// <reference path="../common/controllers/googlemapsctrl.ts" />
/// <reference path="../common/directives/googlemapsdirec.ts" />
/// <reference path="../../application/app/application.ts" />
var googleMaps;
(function (googleMaps) {
    angular.module('googleMaps', ['application']).directive('googleMaps', googleMaps.directive).controller('googleMapsCtrl', googleMaps.controller);
})(googleMaps || (googleMaps = {}));
/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
var sideBar;
(function (sideBar) {
    var config = application.config;

    function sideBarDrct() {
        var direc = {
            restrict: 'E',
            templateUrl: config.sideBar.templateUrl
        };
        return direc;
    }
    sideBar.sideBarDrct = sideBarDrct;
})(sideBar || (sideBar = {}));
var sideBar;
(function (sideBar) {
    function sideBarCtrl($scope, lightsSrvc) {
    }
    sideBar.sideBarCtrl = sideBarCtrl;
})(sideBar || (sideBar = {}));
/// <reference path="../common/directives/sidebardirec.ts" />
/// <reference path="../common/controllers/sidebarctrl.ts" />
/// <reference path="../../application/app/application.ts" />
var sideBar;
(function (sideBar) {
    angular.module('sideBar', []).directive('sideBar', sideBar.sideBarDrct).controller('sideBarCtrl', sideBar.sideBarCtrl);
})(sideBar || (sideBar = {}));
/// <reference path="google-maps/app/googlemaps.ts" />
/// <reference path="side-bar/app/sidebar.ts" />
/// <reference path="application/app/application.ts" />
angular.module('app', ['application', 'googleMaps', 'sideBar']);
//# sourceMappingURL=output.js.map
