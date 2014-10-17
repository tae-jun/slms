module global {
    export function color() {
        var rtn: ng.IDirective = {
            restrict: 'A',
            link: function (scope: IColorScope, elem: IMyJQuery, attrs: ng.IAttributes) {
                scope.color = [0, 0, 0];        //initialize
                
                var key;
                if (attrs['color'] == undefined)
                    key = 'color';
                else
                    key = attrs['color'];

                elem.spectrum({
                    preferredFormat: 'rgb',
                    showButtons: false,
                    move: (color) => {
                        var rgb: number[] = [];
                        rgb[0] = Math.round(color._r);
                        rgb[1] = Math.round(color._g);
                        rgb[2] = Math.round(color._b);
                        
                        scope.$apply(() => {
                            scope[key] = rgb;
                        });
                    }
                });
            }
        };

        return rtn;
    }

    export interface IColorScope extends ng.IScope {
        color: number[];
    }

    export interface IMyJQuery extends ng.IAugmentedJQuery {
        spectrum(options?: any);
    }
}