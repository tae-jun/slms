/// <reference path="../../config.ts" />

module lightMonitor {
    import config = configuration.lightMonitor;

    export function lightMonitorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {
                
            }
        };
    }
}