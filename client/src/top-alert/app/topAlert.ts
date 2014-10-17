/// <reference path="../directives/topalertdrt.ts" />
/// <reference path="../controller/topalertctrl.ts" />
/// <reference path="../../global/app/global.ts" />

module topAlert {
    angular.module('topAlert', [])
        .directive('topAlert', topAlertDrt)
        .controller('topAlertCtrl', TopAlertCtrl);
} 