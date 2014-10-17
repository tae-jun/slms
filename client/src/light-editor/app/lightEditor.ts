/// <reference path="../directives/lighteditordrt.ts" />
/// <reference path="../controller/lighteditorctrl.ts" />
/// <reference path="../../global/app/global.ts" />

module lightEditor {
    angular.module('lightEditor', ['global'])
        .directive('lightEditor', lightEditorDirective)
        .controller('lightEditorCtrl', LightEditorCtrl);
} 