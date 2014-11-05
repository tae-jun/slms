/// <reference path="../../config.ts" />
module global {
    import config = configuration.global;

    export function sliderDrt(): ng.IDirective {
        var drt: ng.IDirective = {
            replace: true,
            restrict: 'E',
            templateUrl: config.sliderTplUrl,
            scope: {
                model: '='
            },
            link: (scope: ISliderScope, elem: ISliderJQuery, attr: ng.IAttributes) => {
                elem.slider({
                    value: scope.model,
                    min: 0,
                    max: 15,
                    slide: (event, ui) => {
                        scope.model = ui.value;
                        scope.$apply();
                    }
                });

                scope.$watch('model', (newValue, oldValue) => {
                    elem.slider('value', newValue);
                });
            }
        };

        return drt;
    }

    export interface ISliderScope extends ng.IScope {
        model: number;
    }

    export interface ISliderJQuery extends ng.IAugmentedJQuery {
        slider: any;
    }
} 