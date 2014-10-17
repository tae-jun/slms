/// <reference path="../../config.ts" />

module lightEditor {
    import config = configuration.lightEditor;

    export function lightEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {

            }
        };
    }
}