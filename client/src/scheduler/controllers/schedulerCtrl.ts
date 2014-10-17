/// <reference path="../../../typings/d3/d3.d.ts" />
module scheduler {
    import SchedulerService = global.SchedulerService;
    import Scheduler = global.Scheduler;

    export class SchedulerCtrl {
        private scheduler: Scheduler;
        private events: global.IDaily[];
        private svg;

        constructor(schedulerService: SchedulerService, $scope: ISchedulerScope, $rootScope: ng.IRootScopeService) {
            $scope.show = false;

            $scope.newEvent = () => {
                // scheduler -> eventEditor
                $rootScope.$broadcast('scheduler:newEvent');
            };

            // from groupMonitor 
            $scope.$on('groupMonitor:sClick', (event, schedulerId: string) => {
                console.log('scheduler:sClick:' + schedulerId);

                $scope.scheduler = schedulerService.find(schedulerId);
                this.events = $scope.scheduler.daily;
                this.redraw();

                $scope.show = true;
            });

            // eventEditor -> scheduler
            $scope.$on('eventEditor:insertEvent', (event, newEvent: IEvent) => {
                var daily: global.IDaily = {
                    rgb: newEvent.rgb,
                    date: newEvent.date,
                    h: newEvent.date.getHours(),
                    m: newEvent.date.getMinutes()
                };
                
                $scope.scheduler.insertDaily(daily, () => {
                    this.events = $scope.scheduler.daily;
                    this.redraw();
                });
            });
        }

        redraw() {
            if (this.svg)
                this.svg.remove();
            this.draw();
        }

        draw() {
            var select = $('.scheduler main .left');    // element that contains chart
            var width = select.width();
            var height = select.height();

            var xAxisPadding = 100;

            // x scale, domain: 24h, range: width of element
            var xScale = d3.time.scale()
                .domain([new Date().setHours(0, 0, 0), new Date().setHours(23, 59, 59)])
                .rangeRound([0, width]);

            // y scale, domain: 0~255, range: height of element
            var yScale = d3.scale.linear()
                .domain([0, 255])
                .rangeRound([0, height]);

            //Create SVG element
            var svg = d3.select('.scheduler main .left')
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            this.svg = svg;

            //Create bars
            svg.selectAll("rect")
                .data(this.events)
                .enter()
                .append("rect")
                .attr("x", function (d, i) {
                    return xScale(d.date);
                })
                .attr("y", 0)
                .attr("width", (d, i) => {
                    var nextD = this.events[i + 1];

                    if (nextD)
                        return xScale(nextD.date) - xScale(d.date);
                    else
                        return width - xScale(d.date);
                })
                .attr("height", height)
                .attr("fill", function (d) {
                    return 'rgb(' + d.rgb[0] + ', ' + d.rgb[1] + ', ' + d.rgb[2] + ')';
                });

            // X-Axis (time)
            var xAxis = d3.svg.axis()
                .scale(xScale)
                .ticks(d3.time.hour)
                .tickFormat(d3.time.format('%H시'))
                .orient('bottom');      // place label under line

            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(0, ' + (height - xAxisPadding) + ')')
                .call(xAxis);
        }
    }

    export interface ISchedulerScope extends ng.IScope {
        scheduler: Scheduler;

        show: boolean;

        newEvent(): void;
    }
}