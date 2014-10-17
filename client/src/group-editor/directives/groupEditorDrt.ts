/// <reference path="../../config.ts" />

module groupEditor {
    import config = configuration.groupEditor;

    export function groupEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {

            }
        };
    }
}