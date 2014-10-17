/// <reference path="../controller/groupeditorctrl.ts" />
/// <reference path="../directives/groupeditordrt.ts" />
/// <reference path="../../global/app/global.ts" />

module groupEditor {
    angular.module('groupEditor', ['global'])
        .directive('groupEditor', groupEditorDirective)
        .controller('groupEditorCtrl', GroupEditorCtrl);
}  