/// <reference path="../../config.ts" />
module global {
    import config = configuration.global;

    export class SchedulerService {
        private $http: ng.IHttpService;

        private isFetching: boolean;
        private lastUpdate: Date;
        private callbacks: Function[];

        private schedulers: Scheduler[];
        private idSchedulers: Object;       // store scheduler by id. Object key is _id, value is Scheduler

        constructor($http) {
            this.$http = $http;

            this.isFetching = false;
            this.lastUpdate = new Date(1994, 2, 4);
            this.callbacks = [];

            this.schedulers = [];
        }

        // return schedulers. Doesn't request to server
        get(): Scheduler[] {
            return this.schedulers;
        }

        // find by id
        find(schedulerId: string): Scheduler {
            return this.idSchedulers[schedulerId];
        }

        // request to server
        fetch(callback?: (schedulers: Scheduler[]) => void): Scheduler[]{
            // validate callback is Function or not
            if (typeof callback != 'function')
                callback = () => { };

            // only fetch data when need update
            if ((new Date().getTime() - this.lastUpdate.getTime()) > config.schedulerLastUpdateTime) {
                this.callbacks.push(callback);

                if (!this.isFetching) {
                    this.isFetching = true;

                    // fetch scheduler data
                    this.$http.get(config.schedulerUrl)
                        .success((schedulers: Scheduler[]) => {
                            // clean schedulers
                            // cf) clean this way, because i want to keep object reference
                            // you must not just give new Array
                            this.schedulers.splice(0, this.schedulers.length);
                            // clean idSchedulers
                            this.idSchedulers = {};

                            // refine each data
                            schedulers.forEach((scheduler) => {
                                // merge object from server and local class into one object
                                scheduler = $.extend(new Scheduler(this.$http), scheduler);
                                // create Date object
                                scheduler.daily.forEach((value) => {
                                    var date = new Date();
                                    date.setHours(value.h, value.m);

                                    value.date = date;
                                });

                                // push scheduler to array
                                this.schedulers.push(scheduler);
                                // store at idScheduler
                                this.idSchedulers[scheduler._id] = scheduler;
                            });
                            
                            // execute callbacks
                            while (this.callbacks.length)
                                this.callbacks.pop()(this.schedulers);

                            // update last updated time
                            this.lastUpdate = new Date();
                            console.log('schedulers fetched at ' + this.lastUpdate);
                        })
                        .error((res) => {
                            console.warn('schedulerService Fetching Error');
                            console.warn(res);
                        })
                        .finally(() => {
                            this.isFetching = false;
                        });
                }
            }
            else
                callback(this.schedulers);

            return this.schedulers;
        }
    }

    export class Scheduler {
        _id: string;
        name: string;
        daily: IDaily[];

        private http: ng.IHttpService;

        constructor($http: ng.IHttpService) {
            this.http = $http;
        }

        insertDaily(daily: IDaily, callback?: () => void) { 
            // delete properties that don't need for server
            delete daily.date;
            // POST
            this.http.post(config.schedulerUrl + '/' + this._id, daily)
                .success((res: Scheduler) => {
                    // create Date object
                    res.daily.forEach((value) => {
                        var date = new Date();
                        date.setHours(value.h, value.m);

                        value.date = date;
                    });
                    // refresh daily
                    this.daily = res.daily;

                    if (callback)
                        callback();
                })
                .error((err) => {
                    console.log('schedulerService insertDaily error');
                    console.log(err);
                });
        }
    }

    export interface IDaily {
        h: number;              // from db
        m: number;              // from db
        rgb: number[];          // from db

        date: Date;
    }
}