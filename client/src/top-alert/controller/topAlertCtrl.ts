module topAlert {

    export class TopAlertCtrl {
        newMarker: google.maps.Marker;

        constructor($scope: ITopAlertScope, lightService: global.LightService, $rootScope: ng.IRootScopeService) {

            var templates = {
                newLightInfo: 'newLightInfo',
                newLightConfirm: 'newLightConfirm',
                addLights: 'addLights'
            };

            $scope.newLightConfirm = () => {
                $scope.template = null;

                console.log('topAlert:createLight');
                $rootScope.$broadcast('topAlert:createLight', this.newMarker);
            };

            /* Events */

            // googleMaps

            $scope.$on('googleMaps:newLightInfo', () => {
                $scope.template = templates.newLightInfo;
            });

            $scope.$on('googleMaps:newLightConfirm', (event, newMarker: google.maps.Marker) => {
                $scope.template = templates.newLightConfirm;
                $scope.$apply();
                this.newMarker = newMarker;
            });


            // groupEditor

            $scope.$on('groupEditor:addLights', (event) => {
                console.log('-> topAlert:addLights')
                $scope.template = templates.addLights;
            });


            // selection

            $scope.$on('selection:confirm', (event) => {
                console.log('-> topAlert:confirm');
                $scope.template = null;
            });
        }
    }

    export interface ITopAlertScope extends ng.IScope {
        template;

        newLightConfirm(): void;
    }
}