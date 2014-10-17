/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
module sideBar {
    import config = application.config;

    export function sideBarDrct() {
        var direc: ng.IDirective = {
            restrict: 'E',
            templateUrl: config.sideBar.templateUrl
        };
        return direc;
    }
}