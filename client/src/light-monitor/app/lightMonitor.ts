/// <reference path="../../global/app/global.ts" />
/// <reference path="../controller/lightmonitorctrl.ts" />
/// <reference path="../directives/lightmonitordrt.ts" />

module lightMonitor {
    angular.module('lightMonitor', ['global'])
        .controller('lightMonitorCtrl', LightMonitorCtrl)
        .directive('lightMonitor', lightMonitorDirective);
}