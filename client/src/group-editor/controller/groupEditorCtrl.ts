module groupEditor {
    import Light = global.Light;
    import Group = global.Group;

    export class GroupEditorCtrl {

        $scope: IGroupEditorScope;

        constructor(
            $scope: IGroupEditorScope,
            $rootScope: ng.IRootScopeService,
            groupService: global.GroupService
            ) {
            this.$scope = $scope;
            $scope.show = false;

            $scope.confirm = () => {
                var lightIdArr = [];

                if ($scope.lights) {
                    $scope.lights.forEach((value) => {
                        lightIdArr.push(value._id);
                    });
                }

                var data = {
                    name: $scope.group.name,
                    lights: lightIdArr
                };
                
                groupService.create(data, (res) => {
                    console.log('create group success: ' + res.name);
                    groupService.fetch();

                    $scope.show = false;
                    $scope.lights = null;
                    $scope.group = null;

                    // -> googleMaps
                    console.log('groupEditor:confirm ->');
                    $rootScope.$broadcast('groupEditor:confirm');
                });
            };

            $scope.addLights = () => {
                $scope.show = false;

                // -> topAlert, googleMaps, selection
                console.log('groupEditor:addLights ->');
                $rootScope.$broadcast('groupEditor:addLights', $scope.lights);
            };

            $scope.$on('sideBar:newGroup', (event) => {
                console.log('-> groupEditor:newGroup');
                $scope.show = true;
            });

            $scope.$on('selection:confirm', (event, lights: Light[]) => {
                console.log('-> groupEditor:confirm');
                console.log(lights);
                $scope.show = true;
                $scope.lights = lights;
            });

            // windowAdmin -> group-editor
            $scope.$on('windowAdmin:closeRight', (event, name) => {
                if (name != 'groupEditor')
                    this._closeWin();
            });
        }

        private _closeWin() {
            this.$scope.show = false;
        }

    }

    export interface IGroupEditorScope extends ng.IScope {
        show: boolean;
        group: Group;
        lights: Light[];

        confirm(): void;
        addLights(): void;
    }
}