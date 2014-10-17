/// <reference path="../common/controllers/appctrl.ts" />
/// <reference path="../common/services/lightssrvc.ts" />

module application {
    angular.module('application', ['ngResource'])
        .factory('lightsSrvc', lightsSrvc)
        .controller('appCtrl', appCtrl);
}
