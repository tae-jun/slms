module scheduler {
    import config = configuration.scheduler;

    export function eventEditorDrt() {
        var rtn: ng.IDirective = {
            replace: true,
            restrict: 'E',
            templateUrl: config.eventEditor.templateUrl,
            link: (scope: ng.IScope, elem: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes) => {
                
            }
        };

        return rtn;
    }
}