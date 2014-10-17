module global {
    import config = configuration.global;

    export class GroupService {
        // contains group array
        groups: Group[];
        // contains group with key. idGroups[<_id>] = <the group that id is _id>
        idGroups: any;

        // indicates when is last updated time
        lastUpdate: Date;
        // is it fetching data from server now?
        isFetching: boolean;

        callbacks: Function[];

        // angular
        $http: ng.IHttpService;
        lightService: LightService;
        $rootScope: ng.IRootScopeService;

        constructor(
            $http: ng.IHttpService,
            lightService: LightService,
            $rootScope: ng.IRootScopeService
            ) {
            this.groups = [];
            this.idGroups = {};

            // need update
            this.lastUpdate = new Date(1994, 2, 4);
            this.isFetching = false;

            this.callbacks = [];

            // angular
            this.$http = $http;
            this.lightService = lightService;
            this.$rootScope = $rootScope;
        }

        get(): Group[] {
            return this.groups;
        }

        fetch(callback?: (groups: Group[]) => void): Group[] {
            // if group is updated just now, just call callback function
            if (new Date().getTime() - this.lastUpdate.getTime() < config.groupLastUpdateTime) {
                if (callback)
                    callback(this.groups);
            }
            else {
                // push callback to callback array
                if (callback) {
                    this.callbacks.push(callback);
                }

                // if it is not fetching, fetch
                if (!this.isFetching) {
                    this.isFetching = true;

                    this.$http.get(config.groupsUrl)
                        .success((data: any[]) => {
                            // clear groups
                            // to keep equal object refrence, 
                            // do not define new array but splice existing array
                            this.groups.splice(0, this.groups.length);

                            // process group data
                            data.forEach((value) => {
                                // create new Group object
                                var tmp = new Group(value, this.$http);
                                // push processed group into group array
                                this.groups.push(tmp);
                                // and also into idGroups
                                this.idGroups[tmp._id] = tmp;
                            });

                            // process for lights that do not belong to group
                            var groupNull = new Group({ _id: 'groupNull', name: '그룹이 없는 가로등', rgb: [0, 0, 0] }, this.$http);
                            this.groups.push(groupNull);
                            this.idGroups[groupNull._id] = groupNull;

                            // fetch lights and link to each group
                            this.lightService.fetch((lights) => {
                                lights.forEach((value) => {
                                    if (value.gid)
                                        this.idGroups[value.gid].lights.push(value);
                                    else
                                        this.idGroups['groupNull'].lights.push(value);
                                });
                            });

                            while (this.callbacks.length) {
                                this.callbacks.pop()(this.groups);
                            }

                            // update last updated time
                            this.lastUpdate = new Date();
                            console.log('groups fetched at ' + this.lastUpdate);
                        })
                        .error((err) => {
                            console.error('groupService fetch() error');
                            console.error(err);
                        })
                        .finally(() => {
                            this.isFetching = false;
                        });
                }

            }

            return this.groups;
        }

        find(_id: string): Group {
            return this.idGroups[_id];
        }

        create(data, callback?: (res) => void): void {
            this.$http.post(config.groupsUrl, data)
                .success((res) => {
                    if (callback)
                        callback(res);
                })
                .error((err) => {
                    console.error('groupService create() error');
                    console.error(err);
                });
        }

        control(_id: string, rgb: number[], callback?: (rgb: number[]) => void): void {
            var data = {
                _id: _id,
                rgb: rgb
            };

            this.$http.post(config.groupCtrlUrl, data)
                .success((res: { rgb: number[] }) => {
                    this.find(_id).rgb = rgb;

                    if (callback)
                        callback(res.rgb);

                    this._rgbChanged(_id, rgb);
                })
                .error((err) => {
                    console.error('groupService control() error');
                    console.error(err);
                });
        }

        private _rgbChanged(_id: string, rgb: number[]) {
            // groupService -> sideBar
            this.$rootScope.$broadcast('groupService:rgbChanged', _id, rgb);
        }
    }

    export class Group {
        // from db
        _id: string;
        name: string;
        sid: string;
        rgb: number[];

        // local
        lights: Light[];

        // angular
        $http: ng.IHttpService;

        constructor(data, http) {
            // merge this and data into this
            $.extend(this, data);

            this.$http = http;
            this.lights = [];
        }
    }
}