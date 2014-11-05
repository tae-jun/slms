module lightMonitor {
    export class LightMonitorCtrl {
        // window name for windowAdmin
        private _winName = 'lightMonitor';

        constructor(
                $scope: ILightMonitorScope,
                $rootScope: ng.IRootScopeService,
                lightService: global.LightService,
                groupService: global.GroupService,
                windowAdmin: global.WindowAdminService
            ) {
            $scope.show = false;
            $scope.rgb = [0, 0, 0];
            $scope.newRgb = [0, 0, 0];


            /*
             * Methods
             */

            $scope.control = () => {
                //$scope.light.control($scope.newRgb, (res) => {
                //    $scope.rgb = $scope.newRgb;
                //});
                console.log($scope.light.dim);
            };

            $scope.edit = () => {
                // lightMonitor -> lightEditor
                $rootScope.$broadcast('lightMonitor:editLight', $scope.light);
            };

            $scope.goToGroup = () => {
                windowAdmin.closeRight();
                //lightMonitor -> groupMonitor
                $rootScope.$broadcast('lightMonitor:goToGroup', $scope.light.gid);
            };

            $scope.btnClose = () => {
                $scope.show = false;
            };


            /*
             * Watch Expressions
             */

            $scope.$watch('light.rgb', (newValue, oldValue) => {
                if ($scope.light) {
                    var textColor;
                    var rgb = newValue;

                    // set proper text color
                    if ((rgb[0] + rgb[1] + rgb[2]) > 382)
                        textColor = 'black';
                    else
                        textColor = 'white';

                    $scope.header = {
                        'background-color': 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                        'color': textColor
                    };
                }
            });

            $scope.$watch('show', (newValue, oldValue, scope) => {
                if (newValue)
                    windowAdmin.closeRight(this._winName);
            });

            /*
             * Event Listeners
             */
            $scope.$on('sideBar:lightClick', (event, _id: string) => {
                $scope.light = lightService.find(_id);
                $scope.group = groupService.find($scope.light.gid);
                $scope.show = true;
            });

            $scope.$on('googleMaps:markerClick:normal', (event, _id: string) => {
                console.log('-> lightMonitor:markerClick:normal:' + _id);
                $scope.light = lightService.find(_id);
                $scope.group = groupService.find($scope.light.gid);
                $scope.show = true;
                $scope.$apply();
            });

            // windowAdmin -> lightMonitor
            $scope.$on('windowAdmin:closeRight', (event, name) => {
                if (name != this._winName)
                    $scope.show = false;
            });
        }
    }

    export interface ILightMonitorScope extends ng.IScope {
        light: global.Light;
        show: boolean;
        rgb: number[];
        newRgb: number[];
        group: global.Group;
        header: any;

        control(): void;        // change light's color
        edit(): void;           // edit properties
        goToGroup(): void;      // click group button
        btnClose(): void;       // click close button
    }
}  