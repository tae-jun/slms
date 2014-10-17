/// <reference path="../../config.ts" />

module groupMonitor {
    import config = configuration.groupMonitor;

    export function groupMonitorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {

            }
        };
    }
}