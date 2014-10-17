/// <reference path="../../../typings/angularjs/angular.d.ts" />
/// <reference path="../../config.ts" />

module global {
    import config = configuration.global;

    export class LightService {

        /*
         * local variables
         */

        // light storage for light array
        lights: Light[];
        // light storage for searching light by id. key is id, and value is light
        // you can search light, typing like this, idLights[<_id>]
        idLights: Object;
        // last updated time
        lastUpdate: Date;
        // latest update time
        lastUpdateDuration: number;
        // is lightService Fetching data from server?
        isFetching: boolean;
        // storage for callback functions
        callbacks: Function[];


        /*
         * angular
         */

        $http: ng.IHttpService;


        constructor($http: ng.IHttpService) {
            /*
             * initialize
             */
            // local variables
            this.lights = [];
            this.idLights = {};
            // set last updated time to long ago, because this needs update
            this.lastUpdate = new Date(1994, 2, 4);
            this.lastUpdateDuration = config.lightLastUpdateTime;
            this.isFetching = false;
            this.callbacks = [];
            // angular
            this.$http = $http;
        }

        /**
         * This method doesn't fetch data from db,
         * but just return local variables lights
         */
        get(): Light[] {
            return this.lights;
        }

        /**
         * Find light by id.
         * This method also doesn't fetch data from db
         */
        find(_id: string): Light {
            return this.idLights[_id];
        }

        /**
         * Fetch data from db.
         * This method only fetch data from db,
         * if time passed last update duration
         */
        fetch(callback?: (lights: Light[]) => void) {
            // push callback function into callback array, if callback function exists
            if (callback)
                this.callbacks.push(callback);

            // only fetch data from server when time passed last update duration
            if (new Date().getTime() - this.lastUpdate.getTime() > this.lastUpdateDuration) {
                // if it is not fetching, fetch
                if (!this.isFetching) {
                    // now it is fetching
                    this.isFetching = true;
                    // request to server
                    this.$http.get(config.lightsUrl)
                        .success((data: any[]) => {
                            // clear light array
                            // because we need to keep light array's object reference same with before
                            // we must splice array, not just give new array
                            this.lights.splice(0, this.lights.length);
                            // refine each data and push them into lights and id lights
                            data.forEach((light) => {
                                var newLight = new Light(this.$http, light);
                                this.lights.push(newLight);
                                this.idLights[newLight._id] = newLight;
                            });
                            // call callbacks
                            while (this.callbacks.length)
                                this.callbacks.pop()(this.lights);
                            // update last update time
                            this.lastUpdate = new Date();

                            console.log('lights fetched at ' + this.lastUpdate);
                        })
                        .error((err) => {
                            console.error('GET -> ' + config.lightsUrl + ' ERROR');
                            console.error(err);
                        })
                        .finally(() => {
                            // fetching finished
                            this.isFetching = false;
                        });
                }
            }
            else {
                // call callbacks
                while (this.callbacks.length)
                    this.callbacks.pop()(this.lights);
            }

            return this.lights;
        }

        /**
         * Request creating light action to server
         */
        create(data: Object, callback?: (res: any) => void) {
            // request to server
            this.$http.post(config.lightsUrl, data)
                .success((res) => {
                    if (callback)
                        callback(res);
                })
                .error((err) => {
                    console.error('POST -> ' + config.lightsUrl + ' ERROR');
                    console.error(err);
                });
        }
    }

    export class Light {
        // from db
        _id: string;
        name: string;
        lat: number;
        lng: number;
        gid: string;
        rgb: number[];

        // local
        marker: googleMaps.Marker;

        // angular
        $http: ng.IHttpService;

        constructor($http?: ng.IHttpService, data?: Object) {
            // register angular service $http.
            // if $http is undefined, get angular module and get $http service
            this.$http = $http || angular.injector(['ng']).get('$http');
            // merge 2 data into one if data exist
            if (data)
                $.extend(this, data);
        }

        /**
         * Fetch one light's data for this light from server
         */
        fetch(callback?: (light: Light) => void): Light {
            this.$http.get(config.lightsUrl)
                .success((data: Light) => {
                    // merge local object and property from db
                    $.extend(this, data);

                    if (callback)
                        callback(this);
                })
                .error(() => {
                    console.error('http get error');
                });

            return this;
        }

        /**
         * Change this light's color
         */
        control(rgb: number[], callback?: (res: any) => void) {
            // request data form
            var data = {
                _id: this._id,
                rgb: rgb
            };
            // request to server
            this.$http.post(config.lightCtrlUrl + '/' + this._id, data)
                .success((res) => {
                    if (callback)
                        callback(res);
                })
                .error((err) => {
                    console.error('POST -> ' + config.lightCtrlUrl + ' ERROR');
                    console.error(err);
                });
        }

        /**
         * Update light. If data is not described, just update this
         */
        update(callback?: Function): void;
        update(data: Object, callback?: Function): void;
        update(data_callback: any, callback?: Function): void {
            if (callback == undefined)
                callback = function () { }

            var doc;        // data to be updated
            if (typeof data_callback == 'Object')
                doc = data_callback;
            else if (typeof data_callback == ('function' || 'undefined'))
                doc = {
                    name: this.name,
                    lat: this.lat,
                    lng: this.lng,
                    gid: this.gid,
                    rgb: this.rgb
                };

            this.$http.post(config.lightsUrl + '/' + this._id, doc)
                .success((res) => {
                    if (callback)
                        callback(res);
                })
                .error((err) => {
                    console.error('POST -> ' + config.lightsUrl + ' ERROR');
                    console.error(err);
                });
        }
    }
}