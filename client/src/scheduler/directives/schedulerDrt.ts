module scheduler {
    import config = configuration.scheduler;

    export function schedulerDrt() {
        var rtn: ng.IDirective = {
            replace: false,
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope: ng.IScope, instanceElement: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes) => {

            }
        };

        return rtn;
    }
}