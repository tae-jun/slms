/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="global/app/global.ts" />
/// <reference path="google-maps/app/googlemaps.ts" />
/// <reference path="side-bar/app/sidebar.ts" />
/// <reference path="light-monitor/app/lightmonitor.ts" />
/// <reference path="top-alert/app/topalert.ts" />
/// <reference path="group-editor/app/groupeditor.ts" />
/// <reference path="selection/app/selection.ts" />
/// <reference path="scheduler/app/scheduler.ts" />

var modules = [
    'googleMaps',
    'global',
    'sideBar',
    'lightMonitor',
    'topAlert',
    'lightEditor',
    'groupMonitor',
    'groupEditor',
    'selection',
    'scheduler'
];

angular.module('app', modules)
    .run(($window) => {

    });