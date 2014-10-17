/// <reference path="../../../../../scripts/typings/google-maps/google.maps.d.ts" />
module googleMaps {

    import gMaps = google.maps;
    import app = application;

    export function controller($scope: gMapScope, lightsSrvc: app.lightResource) {
        $scope.scopeName = 'googleMaps scope';

        var mapOptions: gMaps.MapOptions = {
            center: new gMaps.LatLng(37.6440844, 126.7868542),
            zoom: 15,
            mapTypeId: gMaps.MapTypeId.ROADMAP,
            disableDefaultUI: true
        };

        $scope.map = new gMaps.Map(document.getElementById('map_canvas'), mapOptions);

        // set location to my current location
        navigator.geolocation.getCurrentPosition((position: Position) => {
            var myPosition = new gMaps.LatLng(position.coords.latitude, position.coords.longitude);
            $scope.map.setCenter(myPosition);
        });

        $scope.markers = new Array();
        
        var lights = lightsSrvc.query(() => {
            for (var i = 0; i < lights.length; i++) {
                var light = lights[i];
                console.log(light);
                var markerOption: gMaps.MarkerOptions = {
                    title: light.name,
                    position: new gMaps.LatLng(light.lat, light.lng),
                    map: $scope.map
                }
                $scope.markers.push(new gMapMarker(markerOption));
            }
        });
    }

    export class gMapMarker extends gMaps.Marker {
        markerOptions: gMaps.MarkerOptions;

        constructor(markerOptions: gMaps.MarkerOptions) {
            super(markerOptions);
            this.markerOptions = markerOptions;
        }
    }

    export interface gMapScope extends ng.IScope {
        map: google.maps.Map;
        markers: google.maps.Marker[];
        scopeName: string;
    }
} 