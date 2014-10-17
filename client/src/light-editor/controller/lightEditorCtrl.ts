module lightEditor {
    import Light = global.Light;

    export class LightEditorCtrl {
        light: Light;

        // angular
        $scope: ILightEditorScope;
        $rootScope: ng.IRootScopeService;
        windowAdmin: global.WindowAdminService;

        private _winName = 'lightEditor';

        constructor(
            $scope: ILightEditorScope,
            groupService: global.GroupService,
            lightService: global.LightService,
            $rootScope: ng.IRootScopeService,
            windowAdmin: global.WindowAdminService
            ) {
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.windowAdmin = windowAdmin;

            $scope.show = false;

            $scope.groups = groupService.fetch();
            $scope.light = new Light();

            $scope.confirm = () => {
                if ($scope.light._id) {
                    $scope.light.update((res) => {
                        console.log(res);
                    });
                }
                else {
                    lightService.create($scope.light, (res) => {
                        groupService.fetch();
                        this._finished();
                    });
                }
            };

            $scope.btnClose = () => {
                this._finished();
            };

            $scope.$on('topAlert:createLight', (event, newMarker: google.maps.Marker) => {
                console.log('lightEditor:createLight');

                $scope.light = new Light();
                $scope.light.lat = newMarker.getPosition().lat();
                $scope.light.lng = newMarker.getPosition().lng();
                $scope.show = true;
            });

            // google-maps -> light-editor
            $scope.$on('googleMaps:newMarkerPositionChanged', (event, newMarker: googleMaps.Marker) => {
                $scope.light.lat = newMarker.getPosition().lat();
                $scope.light.lng = newMarker.getPosition().lng();
                $scope.$apply();
            });

            // lightMonitor -> lightEditor
            $scope.$on('lightMonitor:editLight', (event, light: Light) => {
                // get target light
                $scope.light = light;
                // close other windows except me (lightEditor)
                windowAdmin.closeRight(this._winName);
                // show window
                $scope.show = true;
            });
        }

        private _finished(): void {
            // lightEditor -> side-bar, google-maps
            this.$rootScope.$broadcast('lightEditor:finished');
            this.$scope.show = false;
        }

    }

    export interface ILightEditorScope extends ng.IScope {
        show: boolean;
        light: global.Light;
        groups: global.Group[];

        confirm(): void;
        btnClose(): void;
    }
}