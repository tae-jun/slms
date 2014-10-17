module googleMaps {
    export function googleMapsDrt() {
        return {
            restrict: 'E',
            template: '<div id="map_canvas" ng-controller="GoogleMapsCtrl"></div>'
        };
    }
}