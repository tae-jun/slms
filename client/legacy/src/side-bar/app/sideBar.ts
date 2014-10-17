/// <reference path="../common/directives/sidebardirec.ts" />
/// <reference path="../common/controllers/sidebarctrl.ts" />
/// <reference path="../../application/app/application.ts" />
module sideBar {
    angular.module('sideBar', [])
        .directive('sideBar', sideBarDrct)
        .controller('sideBarCtrl', sideBarCtrl);
} 