/// <reference path="../../config.ts" />

module sideBar {
    import config = configuration.sideBar;

    export class SideBarCtrl {

        // angular
        $scope: ISideBarScope;
        groupService: global.GroupService;

        constructor($scope: ISideBarScope, groupService: global.GroupService, $rootScope: ng.IRootScopeService) {
            /*
             * initialize
             */
            // class
            this.$scope = $scope;
            this.groupService = groupService;

            // angular scope
            $scope.groupStyle = {};
            $scope.visible = true;


            var colors = ['red', 'darkorange', 'goldenrod', 'green', 'teal', 'blue', 'purple', 'deepskyblue'];

            var random = (max: number) => {
                return Math.round(Math.random() * max);
            };

            $scope.headerStyle = {
                'background-color': colors[random(colors.length - 1)]
            };

            setInterval(() => {
                $scope.headerStyle = {
                    'background-color': colors[random(colors.length - 1)]
                };
                $scope.$apply();
            }, config.headerChangeTime);

            $scope.groups = groupService.fetch((groups) => {
                $scope.groups = groups;
                this._setGroupRgb();
            });


            $scope.menuOptions = [
                ['Buy', function ($itemScope) {
                    console.log($itemScope);
                }],
                null, // Separator
                ['Sell', function ($itemScope) {
                    console.log($itemScope);
                }]
            ];

            $scope.lightMenu = [
                ['새로운 가로등', ($itemScope) => {
                    console.log($itemScope);
                }]
            ];

            $scope.groupMenu = [
                ['편집', ($itemScope) => {
                    console.log($itemScope);
                }]
            ];


            $scope.lightClick = (_id: string) => {
                $rootScope.$broadcast('sideBar:lightClick', _id);
            };

            $scope.groupClick = (_id: string) => {
                // -> group-monitor
                console.log('sideBar:groupClick');
                $rootScope.$broadcast('sideBar:groupClick', _id);
            };

            $scope.newLight = () => {
                console.log('sideBar:newLight');
                // side-bar -> google-maps
                this._setDisability(true);
                $rootScope.$broadcast('sideBar:newLight');
            };

            $scope.newGroup = () => {
                // -> group-editor
                console.log('sideBar:newGroup ->');
                $rootScope.$broadcast('sideBar:newGroup');
            };

            /*
             * Event Listeners
             */
            $scope.$on('groupService:rgbChanged', (event, _id: string, rgb: number[]) => {
                this._setGroupRgb(_id);
            });

            $scope.$on('windowAdmin:closeLeft', (event, name) => {
                this._setDisability(true);
            });

            // light-editor
            $scope.$on('lightEditor:finished', (event) => {
                this._setDisability(false);
            });
        }

        private _setGroupRgb(_id?: string) {
            var changedGroups = [];

            if (_id) {
                changedGroups.push(this.groupService.find(_id));
            }
            else {
                changedGroups = this.$scope.groups;
            }

            changedGroups.forEach((group) => {
                var textColor;
                var rgb = group.rgb;

                // set proper text color
                if ((rgb[0] + rgb[1] + rgb[2]) > 382)
                    textColor = 'black';
                else
                    textColor = 'white';

                this.$scope.groupStyle[group._id] = {
                    'background-color': 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                    'color': textColor
                }
                });
        }

        private _setDisability(isDisabled: boolean): void {
            if (isDisabled)
                this.$scope.visible = false;
            else
                this.$scope.visible = true;
        }
    }

    export interface ISideBarScope extends ng.IScope{
        groups: global.Group[];
        menuOptions: any[];
        lightMenu: any[];
        groupMenu: any[];

        groupStyle: any;
        headerStyle: any;
        visible: boolean;   // visibility about whole side bar

        lightClick(lightId: string): void;
        groupClick(groupId: string): void;
        newLight(): void;
        newGroup(): void;
    }
} 