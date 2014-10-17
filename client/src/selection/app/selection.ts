/// <reference path="../controller/selectionctrl.ts" />
/// <reference path="../directives/selectiondrt.ts" />

module selection {
    angular.module('selection', [])
        .controller('selectionCtrl', SelectionCtrl)
        .directive('selection', selectionDirective);
}