/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../controller/globalctrl.ts" />
/// <reference path="../directives/ngcontextmenu.ts" />
/// <reference path="../directives/color.ts" />
/// <reference path="../services/schedulers.ts" />
/// <reference path="../services/modalservice.ts" />
/// <reference path="../directives/modalbackdrop.ts" />
/// <reference path="../services/groupservice.ts" />
/// <reference path="../services/windowadmin.ts" />
/// <reference path="../services/lightservice.ts" />
/// <reference path="../directives/slider.ts" />

module global {
    angular.module('global', ['ngResource'])
        .controller('GlobalCtrl', GlobalCtrl)
        .factory('lightService', ($http) => new LightService($http))
        .factory('groupService', ($http, lightService, $rootScope) => new GroupService($http, lightService, $rootScope))
        .factory('schedulerService', ($http) => new SchedulerService($http))
        .factory('$modal', ($compile, $rootScope, $timeout) => new ModalService($compile, $rootScope, $timeout))
        .factory('windowAdmin', ($rootScope) => new WindowAdminService($rootScope))
        .directive('ngContextMenu', ngContextMenu)
        .directive('color', color)
        .directive('modalBackdrop', modalBackdropDrt)
        .directive('slider', sliderDrt)
        .run(($window, lightService: LightService, groupService: GroupService, schedulerService: SchedulerService, $modal: ModalService) => {
            $window.lightService = lightService;
            $window.groupService = groupService;
            $window.schedulerService = schedulerService;
            $window.$modal = $modal;

            lightService.fetch();
            groupService.fetch();
            schedulerService.fetch();
        });
}