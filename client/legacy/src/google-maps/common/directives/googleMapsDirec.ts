module googleMaps {
    export function directive() {
        return {
            restrict: 'E',
            template: '<div id="map_canvas" ng-controller="googleMapsCtrl"></div>'
        };
    }
}