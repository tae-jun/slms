/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../../typings/google-maps/google.maps.d.ts" />

module googleMaps {
    import Map = google.maps.Map;
    import MarkerOptions = google.maps.MarkerOptions;
    import LatLng = google.maps.LatLng;
    import Animation = google.maps.Animation;

    import Light = global.Light;

    export enum State {
        normal = 0,
        selectLights = 1,
        disable = 2
    }

    export class GoogleMapsCtrl {

        private map: google.maps.Map;
        private markers: Marker[] = new Array();
        private selection: Marker[] = new Array();
        private lightService: global.LightService;
        private scope: ng.IScope;
        private rootScope: ng.IRootScopeService;
        private state: State;

        constructor($scope: ng.IScope, lightService: global.LightService, $rootScope: ng.IRootScopeService) {
            // register angular things
            this.rootScope = $rootScope;
            this.scope = $scope;
            this.lightService = lightService;

            // initialize
            this.initialize();



            /* Events */

            // side-bar ->
            $scope.$on('sideBar:lightClick', (event, lightId) => {
                var marker = this.lightService.find(lightId).marker;

                this.cleanSelection();
                this.addSelection(marker);
                this.map.setCenter(marker.getPosition());
            });
            // side-bar ->
            $scope.$on('sideBar:newLight', (event) => {
                console.log('googleMapsCtrl:newLight');

                $rootScope.$broadcast('googleMaps:newLightInfo');

                // click map where you want to create marker
                google.maps.event.addListenerOnce(this.map, 'click', (event) => {
                    this.cleanSelection();

                    var newMarkerOptions: MarkerOptions = {
                        map: this.map,
                        position: event.latLng,
                        draggable: true,
                        animation: Animation.BOUNCE
                    };
                    var newMarker = new Marker(newMarkerOptions);

                    this.markers.push(newMarker);

                    google.maps.event.addListener(newMarker, 'position_changed', () => {
                        // google-maps -> light-editor
                        $rootScope.$broadcast('googleMaps:newMarkerPositionChanged', newMarker);
                    });

                    $rootScope.$broadcast('googleMaps:newLightConfirm', newMarker);
                });
            });


            // group-editor ->
            $scope.$on('groupEditor:addLights', (event, lights: Light[]) => {
                console.log('-> googleMaps:addLights');
                this.setState(State.selectLights);
                if (lights)
                    lights.forEach((light) => {
                        this.addSelection(light.marker);
                        google.maps.event.clearListeners(light.marker, 'click');
                    });
            });
            // group-editor ->
            $scope.$on('groupEditor:confirm', (event) => {
                console.log('-> googleMaps:confirm');
                this.setState(State.normal);
            });


            // selection ->
            $scope.$on('selection:deselect', (event, _id: string) => {
                var light = lightService.find(_id);     // deselected light
                var index = this.selection.indexOf(light.marker);       // index of deselected light
                var deseletedMarker = this.selection.splice(index, 1)[0];     // remove from array and get deselected marker
                deseletedMarker.setAnimation(null);     // stop bouncing

                // add listener again
                google.maps.event.addListenerOnce(deseletedMarker, 'click', () => {
                    this.addSelection(deseletedMarker);
                    // -> selection
                    console.log('googleMaps:markerClick:selectLights ->');
                    this.rootScope.$broadcast('googleMaps:markerClick:selectLights', deseletedMarker._id);
                });
            });
            // selection ->
            $scope.$on('selection:confirm', (event, lights: Light[]) => {
                console.log('-> googleMaps:confirm');
                this.setState(State.disable);
            });


            // lightEditor -> google-maps
            $scope.$on('lightEditor:finished', (event) => {
                this.markers.forEach((marker) => {
                    marker.setMap(null);
                });

                this.lightService.fetch((lights) => {
                    this.markers = [];

                    lights.forEach((value) => {
                        var options: MarkerOptions;
                        options = {
                            _id: value._id,
                            map: this.map,
                            title: value.name,
                            position: new LatLng(value.lat, value.lng)
                        }

                    var marker = new Marker(options);
                        this.markers.push(marker);
                        this.lightService.find(value._id).marker = marker;
                    });

                    this.setState(State.normal);
                });
            });
        }

        cleanSelection() {
            while (this.selection.length) {
                this.selection.pop().setAnimation(null);
            }
        }

        addSelection(marker: Marker) {
            marker.setAnimation(Animation.BOUNCE);
            this.selection.push(marker);
        }

        initialize() {
            // map config
            var mapOptions: google.maps.MapOptions = {
                center: new google.maps.LatLng(37.6440844, 126.7868542),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };
            this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

            this.lightService.fetch((lights) => {
                lights.forEach((value) => {
                    var options: MarkerOptions;
                    options = {
                        _id: value._id,
                        map: this.map,
                        title: value.name,
                        position: new LatLng(value.lat, value.lng)
                    }

                    var marker = new Marker(options);
                    this.markers.push(marker);
                    this.lightService.find(value._id).marker = marker;
                });

                this.setState(State.normal);
            });
        }

        setState(state: State) {
            if (state == State.normal) {
                this.markers.forEach((marker) => {
                    google.maps.event.clearListeners(marker, 'click');
                    google.maps.event.addListener(marker, 'click', () => {
                        this.cleanSelection();
                        this.addSelection(marker);
                        // -> light-monitor
                        console.log('googleMaps:markerClick:normal ->');
                        this.rootScope.$broadcast('googleMaps:markerClick:normal', marker._id);
                    });
                });
            }
            else if (state == State.selectLights) {
                this.cleanSelection();
                this.markers.forEach((marker) => {
                    google.maps.event.clearListeners(marker, 'click');
                    google.maps.event.addListenerOnce(marker, 'click', () => {
                        this.addSelection(marker);
                        // -> selection
                        console.log('googleMaps:markerClick:selectLights ->');
                        this.rootScope.$broadcast('googleMaps:markerClick:selectLights', marker._id);
                    });
                });
            }
            else if (state == State.disable) {
                this.cleanSelection();
                this.markers.forEach((marker) => {
                    google.maps.event.clearListeners(marker, 'click');
                });
            }
        }
    }

    export class Marker extends google.maps.Marker {
        _id: string;
    }

    export interface myMarkerOptions extends google.maps.MarkerOptions {
        _id: string;
    }
}