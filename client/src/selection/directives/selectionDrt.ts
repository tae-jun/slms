/// <reference path="../../config.ts" />

module selection {
    import config = configuration.selection;

    export function selectionDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {

            }
        };
    }
}