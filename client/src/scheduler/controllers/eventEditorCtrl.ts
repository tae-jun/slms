/// <reference path="../../../typings/angularjs/angular.d.ts" />
module scheduler {
    export class EventEditorCtrl {
        constructor($scope: IEventEditorScope, $modal: global.ModalService, $rootScope: ng.IRootScopeService) {
            $scope.show = false;

            $scope.cancel = () => {
                console.log('event edit canceled');
                $scope.show = false;
            };

            // scheduler -> eventEditor
            $scope.$on('scheduler:newEvent', (event) => {
                // initilize time picker
                $scope.date = new Date();
                // initilize color to white
                $scope.rgb = [255, 255, 255];

                // open modal backdrop
                $modal.open();
                // add onModalBackdropCloseListener
                $modal.addOnClick(() => {
                    $scope.show = false;
                    $scope.$apply();

                    // eventEditor -> scheduler
                    var data: IEvent = {
                        rgb: $scope.rgb,
                        date: $scope.date
                    };
                    $rootScope.$broadcast('eventEditor:insertEvent', data);
                });
                // show event editor
                $scope.show = true;
            });
        }
    }

    export interface IEventEditorScope extends ng.IScope {
        rgb: number[];
        date: Date;

        show: boolean;

        cancel(): void;
    }

    export interface IEvent {
        rgb: number[];
        date: Date;
    }
} 