module groupMonitor {
    import Light = global.Light;

    export class GroupMonitorCtrl {

        $scope: IGroupMonitorScope;

        private _winName = 'groupMonitor';

        constructor(
            $scope: IGroupMonitorScope,
            $rootScope: ng.IRootScopeService,
            groupService: global.GroupService,
            schedulerService: global.SchedulerService,
            windowAdmin: global.WindowAdminService
            ) {
            this.$scope = $scope;
            $scope.show = false;
            // because of $watch, it occurs error if it was not initialized
            $scope.rgb = [0, 0, 0];
            $scope.newRgb = [0, 0, 0];

            $scope.control = () => {
                groupService.control($scope._id, $scope.newRgb, (rgb) => {
                    console.log(rgb);
                    $scope.rgb = rgb;
                });
            };

            $scope.sClick = (schedulerId) => {
                console.log(schedulerId);

                // scheduler ->
                console.log('groupMonitor:sClick');
                $rootScope.$broadcast('groupMonitor:sClick', schedulerId);
            };

            $scope.$watch('rgb', (newValue: number[], oldValue) => {
                var textColor;
                var rgb = $scope.rgb;

                // set proper text color
                if ((rgb[0] + rgb[1] + rgb[2]) > 382)
                    textColor = 'black';
                else
                    textColor = 'white';

                $scope.header = {
                    'background-color': 'rgb(' + newValue[0] + ', ' + newValue[1] + ', ' + newValue[2] + ')',
                    'color': textColor
                };
            });


            // [ multiple events for one listener ]
            // sideBar -> groupMonitor
            // lightMonitor -> groupMonitor

            var multEvents = ['sideBar:groupClick', 'lightMonitor:goToGroup'];
            multEvents.forEach((value) => {
                $scope.$on(value, (event, _id: string) => {
                    // -> side-bar
                    console.log('sideBar:groupClick');
                    var group = groupService.find(_id);
                    $scope._id = group._id;
                    $scope.name = group.name;
                    $scope.lights = group.lights;
                    $scope.rgb = group.rgb;
                    $scope.scheduler = schedulerService.find(group.sid);

                    $scope.show = true;
                });
            });


            $scope.$on('windowAdmin:closeRight', (event, name) => {
                if (name != 'groupMonitor')
                    this._closeWin();
            });

            $scope.$watch('show', (newValue, oldValue, scope) => {
                if (newValue)
                    windowAdmin.closeRight(this._winName);
            });
        }

        private _closeWin() {
            this.$scope.show = false;
        }
    }

    export interface IGroupMonitorScope extends ng.IScope {
        _id: string;
        name: string;
        lights: Light[];
        scheduler: global.Scheduler;
        rgb: number[];
        newRgb: number[];

        show: boolean;
        header: any;

        control(): void;
        sClick(schedulerId: string): void;      // schedulerClick
    }
}