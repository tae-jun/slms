module application {
    export function appCtrl($scope: appScope, lightsSrvc: lightResource) {
        $scope.scopeName = 'appCtrl';
    }

    export interface appScope extends ng.IScope {
        scopeName: string;
    }
} 