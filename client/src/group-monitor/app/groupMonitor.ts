/// <reference path="../../global/app/global.ts" />
/// <reference path="../controllers/groupmonitorctrl.ts" />
/// <reference path="../directives/groupmonitordrt.ts" />

module groupMonitor {
    angular.module('groupMonitor', ['global'])
        .directive('groupMonitor', groupMonitorDirective)
        .controller('groupMonitorCtrl', GroupMonitorCtrl);
}   