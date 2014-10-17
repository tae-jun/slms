/// <reference path="../../config.ts" />
module sideBar {
    import config = configuration.sideBar;

    export function sideBarDrt() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: (scope, element: JQuery, attr) => {
                var sideBar = element.find('.sideBar');
                var sideBarElem = sideBar.get(0);

                // mouse wheel listener
                sideBarElem.addEventListener('mousewheel', (ev) => {
                    var top = sideBar.offset().top;
                    var windowHeight = $(window).height();
                    var sideBarHeight = sideBar.height();
                    var computedTop = top + ev.wheelDelta / 4;
                    /*
                    console.log({
                        top: top,
                        windowHeight: windowHeight,
                        sideBarHeight: sideBarHeight,
                        computerTop: computedTop,
                        wheelDelta: ev.wheelDelta,
                        limit: windowHeight - sideBarHeight
                    });*/

                    if ((computedTop >= windowHeight - sideBarHeight - 100) && (computedTop <= 0))
                        sideBar.css('top', computedTop);
                });
            }
        };
    }
}