/// <reference path="../../config.ts" />
module topAlert {
    import config = configuration.topAlert;

    export function topAlertDrt() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {
                var topAlert = element.find('.topAlert');

                var winWidth = $(window).width();
                var eleWidth = topAlert.width();

                //topAlert.css('left', (winWidth - eleWidth) / 2);
            }
        };
    }
}