module global {
    import config = configuration.global;

    export function modalBackdropDrt() {
        var rtn: ng.IDirective = {
            replace: true,
            restrict: 'E',
            templateUrl: config.modalBackdrop.templateUrl,
            link: (scope: ng.IScope, elem: ng.IAugmentedJQuery, instanceAttributes: ng.IAttributes) => {
                
            }
        };

        return rtn;
    }
}