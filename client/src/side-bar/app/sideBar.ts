/// <reference path="../directive/sidebardrt.ts" />
/// <reference path="../../global/app/global.ts" />
/// <reference path="../controller/sidebarctrl.ts" />
module sideBar {
    angular.module('sideBar', ['global'])
        .controller('SideBarCtrl', SideBarCtrl)
        .directive('sideBar', sideBarDrt);
}