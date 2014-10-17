module selection {
    import Light = global.Light;

    export class SelectionCtrl {



        constructor($scope: ISelectionScope, $rootScope: ng.IRootScopeService, lightService: global.LightService) {
            $scope.lights = [];

            $scope.confirm = () => {
                // -> group-editor, topAlert, google-maps
                console.log('selection:confirm ->');
                $rootScope.$broadcast('selection:confirm', $scope.lights);

                $scope.show = false;
                $scope.lights = [];
            }

            $scope.deselect = (light) => {
                var index = $scope.lights.indexOf(light);
                $scope.lights.splice(index, 1);

                // -> googleMaps
                console.log('selection:deselect ->');
                $rootScope.$broadcast('selection:deselect', light._id);
            };



            /* Events */

            // group-editor
            $scope.$on('groupEditor:addLights', (event, lights: Light[]) => {
                console.log('-> selection:addLights');
                if (lights)
                    $scope.lights = lights;
                $scope.show = true;
            });

            // google-maps
            $scope.$on('googleMaps:markerClick:selectLights', (event, _id: string) => {
                console.log('-> selection:markerClick:selectLights:' + _id);
                $scope.lights.push(lightService.find(_id));
                $scope.$apply();
            });
        }


    }

    export interface ISelectionScope extends ng.IScope {
        show: boolean;
        lights: Light[];

        confirm(): void;
        cancel(): void;
        deselect(light: Light): void;
    }
}