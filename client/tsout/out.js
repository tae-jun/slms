var configuration;
(function (configuration) {
    configuration.global = {
        lightsUrl: 'http://localhost/db/lights',
        groupsUrl: 'http://localhost/db/groups',
        schedulerUrl: 'http://localhost/db/schedulers',
        lightCtrlUrl: 'http://localhost/control/light',
        groupCtrlUrl: 'http://localhost/control/group',
        lightLastUpdateTime: 500,
        groupLastUpdateTime: 500,
        schedulerLastUpdateTime: 500,
        modalBackdrop: {
            templateUrl: 'static/modalBackdrop.tpl.html'
        }
    };

    configuration.sideBar = {
        templateUrl: 'static/sideBar.tpl.html',
        headerChangeTime: 10000
    };

    configuration.lightMonitor = {
        templateUrl: 'static/lightMonitor.tpl.html'
    };

    configuration.topAlert = {
        templateUrl: 'static/topAlert.tpl.html'
    };

    configuration.lightEditor = {
        templateUrl: 'static/lightEditor.tpl.html'
    };

    configuration.groupEditor = {
        templateUrl: 'static/groupEditor.tpl.html'
    };

    configuration.selection = {
        templateUrl: 'static/selection.tpl.html'
    };

    configuration.groupMonitor = {
        templateUrl: 'static/groupMonitor.tpl.html'
    };

    configuration.scheduler = {
        templateUrl: 'static/scheduler.tpl.html',
        eventEditor: {
            templateUrl: 'static/eventEditor.tpl.html'
        }
    };
})(configuration || (configuration = {}));
var global;
(function (global) {
    var GlobalCtrl = (function () {
        function GlobalCtrl($scope) {
        }
        return GlobalCtrl;
    })();
    global.GlobalCtrl = GlobalCtrl;
})(global || (global = {}));
var global;
(function (global) {
    function ngContextMenu($parse) {
        var renderContextMenu = function ($scope, event, options) {
            if (!$) {
                var $ = angular.element;
            }
            $(event.currentTarget).addClass('context');
            var $contextMenu = $('<div>');
            $contextMenu.addClass('dropdown clearfix');
            var $ul = $('<ul>');
            $ul.addClass('dropdown-menu');
            $ul.attr({ 'role': 'menu' });
            $ul.css({
                display: 'block',
                position: 'absolute',
                left: event.pageX + 'px',
                top: event.pageY + 'px'
            });
            angular.forEach(options, function (item, i) {
                var $li = $('<li>');
                if (item === null) {
                    $li.addClass('divider');
                } else {
                    var $a = $('<a>');
                    $a.attr({ tabindex: '-1', href: '#' });
                    $a.text(item[0]);
                    $li.append($a);
                    $li.on('click', function () {
                        $scope.$apply(function () {
                            item[1].call($scope, $scope);
                        });
                    });
                }
                $ul.append($li);
            });
            $contextMenu.append($ul);
            $contextMenu.css({
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 9999
            });
            $(document).find('body').append($contextMenu);
            $contextMenu.on("click", function (e) {
                $(event.currentTarget).removeClass('context');
                $contextMenu.remove();
            }).on('contextmenu', function (event) {
                $(event.currentTarget).removeClass('context');
                event.preventDefault();
                $contextMenu.remove();
            });
        };
        return function ($scope, element, attrs) {
            element.on('contextmenu', function (event) {
                $scope.$apply(function () {
                    event.preventDefault();
                    var options = $scope.$eval(attrs.ngContextMenu);
                    if (options instanceof Array) {
                        renderContextMenu($scope, event, options);
                    } else {
                        throw '"' + attrs.ngContextMenu + '" not an array';
                    }
                });
            });
        };
    }
    global.ngContextMenu = ngContextMenu;
})(global || (global = {}));
var global;
(function (global) {
    function color() {
        var rtn = {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                scope.color = [0, 0, 0];

                var key;
                if (attrs['color'] == undefined)
                    key = 'color';
                else
                    key = attrs['color'];

                elem.spectrum({
                    preferredFormat: 'rgb',
                    showButtons: false,
                    move: function (color) {
                        var rgb = [];
                        rgb[0] = Math.round(color._r);
                        rgb[1] = Math.round(color._g);
                        rgb[2] = Math.round(color._b);

                        scope.$apply(function () {
                            scope[key] = rgb;
                        });
                    }
                });
            }
        };

        return rtn;
    }
    global.color = color;
})(global || (global = {}));
var global;
(function (global) {
    var config = configuration.global;

    var SchedulerService = (function () {
        function SchedulerService($http) {
            this.$http = $http;

            this.isFetching = false;
            this.lastUpdate = new Date(1994, 2, 4);
            this.callbacks = [];

            this.schedulers = [];
        }
        SchedulerService.prototype.get = function () {
            return this.schedulers;
        };

        SchedulerService.prototype.find = function (schedulerId) {
            return this.idSchedulers[schedulerId];
        };

        SchedulerService.prototype.fetch = function (callback) {
            var _this = this;
            if (typeof callback != 'function')
                callback = function () {
                };

            if ((new Date().getTime() - this.lastUpdate.getTime()) > config.schedulerLastUpdateTime) {
                this.callbacks.push(callback);

                if (!this.isFetching) {
                    this.isFetching = true;

                    this.$http.get(config.schedulerUrl).success(function (schedulers) {
                        _this.schedulers.splice(0, _this.schedulers.length);

                        _this.idSchedulers = {};

                        schedulers.forEach(function (scheduler) {
                            scheduler = $.extend(new Scheduler(_this.$http), scheduler);

                            scheduler.daily.forEach(function (value) {
                                var date = new Date();
                                date.setHours(value.h, value.m);

                                value.date = date;
                            });

                            _this.schedulers.push(scheduler);

                            _this.idSchedulers[scheduler._id] = scheduler;
                        });

                        while (_this.callbacks.length)
                            _this.callbacks.pop()(_this.schedulers);

                        _this.lastUpdate = new Date();
                        console.log('schedulers fetched at ' + _this.lastUpdate);
                    }).error(function (res) {
                        console.warn('schedulerService Fetching Error');
                        console.warn(res);
                    }).finally(function () {
                        _this.isFetching = false;
                    });
                }
            } else
                callback(this.schedulers);

            return this.schedulers;
        };
        return SchedulerService;
    })();
    global.SchedulerService = SchedulerService;

    var Scheduler = (function () {
        function Scheduler($http) {
            this.http = $http;
        }
        Scheduler.prototype.insertDaily = function (daily, callback) {
            var _this = this;
            delete daily.date;

            this.http.post(config.schedulerUrl + '/' + this._id, daily).success(function (res) {
                res.daily.forEach(function (value) {
                    var date = new Date();
                    date.setHours(value.h, value.m);

                    value.date = date;
                });

                _this.daily = res.daily;

                if (callback)
                    callback();
            }).error(function (err) {
                console.log('schedulerService insertDaily error');
                console.log(err);
            });
        };
        return Scheduler;
    })();
    global.Scheduler = Scheduler;
})(global || (global = {}));
var global;
(function (global) {
    var ModalService = (function () {
        function ModalService($compile, $rootScope, $timeout) {
            this.$compile = $compile;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;

            this.onClickCbs = [];
        }
        ModalService.prototype.open = function () {
            var _this = this;
            var backdropScope = this.$rootScope.$new(true);
            var backdropElem = this.$compile('<modal-backdrop></modal-backdrop>')(backdropScope);
            $('body').append(backdropElem);

            setTimeout(function () {
                backdropElem.addClass('show');

                backdropElem.on('click', function () {
                    while (_this.onClickCbs.length)
                        _this.onClickCbs.pop()();

                    _this.close();
                });
            }, 100);
        };

        ModalService.prototype.close = function () {
            var elems = $('.modalBackdrop').removeClass('show');

            this.$timeout(function () {
                elems.remove();
            }, 1200);
        };

        ModalService.prototype.addOnClick = function (callback) {
            this.onClickCbs.push(callback);
        };
        return ModalService;
    })();
    global.ModalService = ModalService;
})(global || (global = {}));
var global;
(function (global) {
    var config = configuration.global;

    function modalBackdropDrt() {
        var rtn = {
            replace: true,
            restrict: 'E',
            templateUrl: config.modalBackdrop.templateUrl,
            link: function (scope, elem, instanceAttributes) {
            }
        };

        return rtn;
    }
    global.modalBackdropDrt = modalBackdropDrt;
})(global || (global = {}));
var global;
(function (global) {
    var config = configuration.global;

    var GroupService = (function () {
        function GroupService($http, lightService, $rootScope) {
            this.groups = [];
            this.idGroups = {};

            this.lastUpdate = new Date(1994, 2, 4);
            this.isFetching = false;

            this.callbacks = [];

            this.$http = $http;
            this.lightService = lightService;
            this.$rootScope = $rootScope;
        }
        GroupService.prototype.get = function () {
            return this.groups;
        };

        GroupService.prototype.fetch = function (callback) {
            var _this = this;
            if (new Date().getTime() - this.lastUpdate.getTime() < config.groupLastUpdateTime) {
                if (callback)
                    callback(this.groups);
            } else {
                if (callback) {
                    this.callbacks.push(callback);
                }

                if (!this.isFetching) {
                    this.isFetching = true;

                    this.$http.get(config.groupsUrl).success(function (data) {
                        _this.groups.splice(0, _this.groups.length);

                        data.forEach(function (value) {
                            var tmp = new Group(value, _this.$http);

                            _this.groups.push(tmp);

                            _this.idGroups[tmp._id] = tmp;
                        });

                        var groupNull = new Group({ _id: 'groupNull', name: '그룹이 없는 가로등', rgb: [0, 0, 0] }, _this.$http);
                        _this.groups.push(groupNull);
                        _this.idGroups[groupNull._id] = groupNull;

                        _this.lightService.fetch(function (lights) {
                            lights.forEach(function (value) {
                                if (value.gid)
                                    _this.idGroups[value.gid].lights.push(value);
                                else
                                    _this.idGroups['groupNull'].lights.push(value);
                            });
                        });

                        while (_this.callbacks.length) {
                            _this.callbacks.pop()(_this.groups);
                        }

                        _this.lastUpdate = new Date();
                        console.log('groups fetched at ' + _this.lastUpdate);
                    }).error(function (err) {
                        console.error('groupService fetch() error');
                        console.error(err);
                    }).finally(function () {
                        _this.isFetching = false;
                    });
                }
            }

            return this.groups;
        };

        GroupService.prototype.find = function (_id) {
            return this.idGroups[_id];
        };

        GroupService.prototype.create = function (data, callback) {
            this.$http.post(config.groupsUrl, data).success(function (res) {
                if (callback)
                    callback(res);
            }).error(function (err) {
                console.error('groupService create() error');
                console.error(err);
            });
        };

        GroupService.prototype.control = function (_id, rgb, callback) {
            var _this = this;
            var data = {
                _id: _id,
                rgb: rgb
            };

            this.$http.post(config.groupCtrlUrl, data).success(function (res) {
                _this.find(_id).rgb = rgb;

                if (callback)
                    callback(res.rgb);

                _this._rgbChanged(_id, rgb);
            }).error(function (err) {
                console.error('groupService control() error');
                console.error(err);
            });
        };

        GroupService.prototype._rgbChanged = function (_id, rgb) {
            this.$rootScope.$broadcast('groupService:rgbChanged', _id, rgb);
        };
        return GroupService;
    })();
    global.GroupService = GroupService;

    var Group = (function () {
        function Group(data, http) {
            $.extend(this, data);

            this.$http = http;
            this.lights = [];
        }
        return Group;
    })();
    global.Group = Group;
})(global || (global = {}));
var global;
(function (global) {
    var WindowAdminService = (function () {
        function WindowAdminService($rootScope) {
            this.$rootScope = $rootScope;
        }
        WindowAdminService.prototype.closeRight = function (name) {
            if (name == undefined)
                name = '';

            this.$rootScope.$broadcast('windowAdmin:closeRight', name);
        };

        WindowAdminService.prototype.closeAll = function (name) {
            this.$rootScope.$broadcast('windowAdmin:closeRight', name);

            this.$rootScope.$broadcast('windowAdmin:closeLeft', name);
        };
        return WindowAdminService;
    })();
    global.WindowAdminService = WindowAdminService;
})(global || (global = {}));
var global;
(function (global) {
    var config = configuration.global;

    var LightService = (function () {
        function LightService($http) {
            this.lights = [];
            this.idLights = {};

            this.lastUpdate = new Date(1994, 2, 4);
            this.lastUpdateDuration = config.lightLastUpdateTime;
            this.isFetching = false;
            this.callbacks = [];

            this.$http = $http;
        }
        LightService.prototype.get = function () {
            return this.lights;
        };

        LightService.prototype.find = function (_id) {
            return this.idLights[_id];
        };

        LightService.prototype.fetch = function (callback) {
            var _this = this;
            if (callback)
                this.callbacks.push(callback);

            if (new Date().getTime() - this.lastUpdate.getTime() > this.lastUpdateDuration) {
                if (!this.isFetching) {
                    this.isFetching = true;

                    this.$http.get(config.lightsUrl).success(function (data) {
                        _this.lights.splice(0, _this.lights.length);

                        data.forEach(function (light) {
                            var newLight = new Light(_this.$http, light);
                            _this.lights.push(newLight);
                            _this.idLights[newLight._id] = newLight;
                        });

                        while (_this.callbacks.length)
                            _this.callbacks.pop()(_this.lights);

                        _this.lastUpdate = new Date();

                        console.log('lights fetched at ' + _this.lastUpdate);
                    }).error(function (err) {
                        console.error('GET -> ' + config.lightsUrl + ' ERROR');
                        console.error(err);
                    }).finally(function () {
                        _this.isFetching = false;
                    });
                }
            } else {
                while (this.callbacks.length)
                    this.callbacks.pop()(this.lights);
            }

            return this.lights;
        };

        LightService.prototype.create = function (data, callback) {
            this.$http.post(config.lightsUrl, data).success(function (res) {
                if (callback)
                    callback(res);
            }).error(function (err) {
                console.error('POST -> ' + config.lightsUrl + ' ERROR');
                console.error(err);
            });
        };
        return LightService;
    })();
    global.LightService = LightService;

    var Light = (function () {
        function Light($http, data) {
            this.$http = $http || angular.injector(['ng']).get('$http');

            if (data)
                $.extend(this, data);
        }
        Light.prototype.fetch = function (callback) {
            var _this = this;
            this.$http.get(config.lightsUrl).success(function (data) {
                $.extend(_this, data);

                if (callback)
                    callback(_this);
            }).error(function () {
                console.error('http get error');
            });

            return this;
        };

        Light.prototype.control = function (rgb, callback) {
            var data = {
                _id: this._id,
                rgb: rgb
            };

            this.$http.post(config.lightCtrlUrl + '/' + this._id, data).success(function (res) {
                if (callback)
                    callback(res);
            }).error(function (err) {
                console.error('POST -> ' + config.lightCtrlUrl + ' ERROR');
                console.error(err);
            });
        };

        Light.prototype.update = function (data_callback, callback) {
            if (callback == undefined)
                callback = function () {
                };

            var doc;
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

            this.$http.post(config.lightsUrl + '/' + this._id, doc).success(function (res) {
                if (callback)
                    callback(res);
            }).error(function (err) {
                console.error('POST -> ' + config.lightsUrl + ' ERROR');
                console.error(err);
            });
        };
        return Light;
    })();
    global.Light = Light;
})(global || (global = {}));
var global;
(function (global) {
    angular.module('global', ['ngResource']).controller('GlobalCtrl', global.GlobalCtrl).factory('lightService', function ($http) {
        return new global.LightService($http);
    }).factory('groupService', function ($http, lightService, $rootScope) {
        return new global.GroupService($http, lightService, $rootScope);
    }).factory('schedulerService', function ($http) {
        return new global.SchedulerService($http);
    }).factory('$modal', function ($compile, $rootScope, $timeout) {
        return new global.ModalService($compile, $rootScope, $timeout);
    }).factory('windowAdmin', function ($rootScope) {
        return new global.WindowAdminService($rootScope);
    }).directive('ngContextMenu', global.ngContextMenu).directive('color', global.color).directive('modalBackdrop', global.modalBackdropDrt).run(function ($window, lightService, groupService, schedulerService, $modal) {
        $window.lightService = lightService;
        $window.groupService = groupService;
        $window.schedulerService = schedulerService;
        $window.$modal = $modal;

        lightService.fetch();
        groupService.fetch();
        schedulerService.fetch();
    });
})(global || (global = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var googleMaps;
(function (googleMaps) {
    var LatLng = google.maps.LatLng;
    var Animation = google.maps.Animation;

    (function (State) {
        State[State["normal"] = 0] = "normal";
        State[State["selectLights"] = 1] = "selectLights";
        State[State["disable"] = 2] = "disable";
    })(googleMaps.State || (googleMaps.State = {}));
    var State = googleMaps.State;

    var GoogleMapsCtrl = (function () {
        function GoogleMapsCtrl($scope, lightService, $rootScope) {
            var _this = this;
            this.markers = new Array();
            this.selection = new Array();
            this.rootScope = $rootScope;
            this.scope = $scope;
            this.lightService = lightService;

            this.initialize();

            $scope.$on('sideBar:lightClick', function (event, lightId) {
                var marker = _this.lightService.find(lightId).marker;

                _this.cleanSelection();
                _this.addSelection(marker);
                _this.map.setCenter(marker.getPosition());
            });

            $scope.$on('sideBar:newLight', function (event) {
                console.log('googleMapsCtrl:newLight');

                $rootScope.$broadcast('googleMaps:newLightInfo');

                google.maps.event.addListenerOnce(_this.map, 'click', function (event) {
                    _this.cleanSelection();

                    var newMarkerOptions = {
                        map: _this.map,
                        position: event.latLng,
                        draggable: true,
                        animation: Animation.BOUNCE
                    };
                    var newMarker = new Marker(newMarkerOptions);

                    _this.markers.push(newMarker);

                    google.maps.event.addListener(newMarker, 'position_changed', function () {
                        $rootScope.$broadcast('googleMaps:newMarkerPositionChanged', newMarker);
                    });

                    $rootScope.$broadcast('googleMaps:newLightConfirm', newMarker);
                });
            });

            $scope.$on('groupEditor:addLights', function (event, lights) {
                console.log('-> googleMaps:addLights');
                _this.setState(1 /* selectLights */);
                if (lights)
                    lights.forEach(function (light) {
                        _this.addSelection(light.marker);
                        google.maps.event.clearListeners(light.marker, 'click');
                    });
            });

            $scope.$on('groupEditor:confirm', function (event) {
                console.log('-> googleMaps:confirm');
                _this.setState(0 /* normal */);
            });

            $scope.$on('selection:deselect', function (event, _id) {
                var light = lightService.find(_id);
                var index = _this.selection.indexOf(light.marker);
                var deseletedMarker = _this.selection.splice(index, 1)[0];
                deseletedMarker.setAnimation(null);

                google.maps.event.addListenerOnce(deseletedMarker, 'click', function () {
                    _this.addSelection(deseletedMarker);

                    console.log('googleMaps:markerClick:selectLights ->');
                    _this.rootScope.$broadcast('googleMaps:markerClick:selectLights', deseletedMarker._id);
                });
            });

            $scope.$on('selection:confirm', function (event, lights) {
                console.log('-> googleMaps:confirm');
                _this.setState(2 /* disable */);
            });

            $scope.$on('lightEditor:finished', function (event) {
                _this.markers.forEach(function (marker) {
                    marker.setMap(null);
                });

                _this.lightService.fetch(function (lights) {
                    _this.markers = [];

                    lights.forEach(function (value) {
                        var options;
                        options = {
                            _id: value._id,
                            map: _this.map,
                            title: value.name,
                            position: new LatLng(value.lat, value.lng)
                        };

                        var marker = new Marker(options);
                        _this.markers.push(marker);
                        _this.lightService.find(value._id).marker = marker;
                    });

                    _this.setState(0 /* normal */);
                });
            });
        }
        GoogleMapsCtrl.prototype.cleanSelection = function () {
            while (this.selection.length) {
                this.selection.pop().setAnimation(null);
            }
        };

        GoogleMapsCtrl.prototype.addSelection = function (marker) {
            marker.setAnimation(Animation.BOUNCE);
            this.selection.push(marker);
        };

        GoogleMapsCtrl.prototype.initialize = function () {
            var _this = this;
            var mapOptions = {
                center: new google.maps.LatLng(37.6440844, 126.7868542),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            };
            this.map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);

            this.lightService.fetch(function (lights) {
                lights.forEach(function (value) {
                    var options;
                    options = {
                        _id: value._id,
                        map: _this.map,
                        title: value.name,
                        position: new LatLng(value.lat, value.lng)
                    };

                    var marker = new Marker(options);
                    _this.markers.push(marker);
                    _this.lightService.find(value._id).marker = marker;
                });

                _this.setState(0 /* normal */);
            });
        };

        GoogleMapsCtrl.prototype.setState = function (state) {
            var _this = this;
            if (state == 0 /* normal */) {
                this.markers.forEach(function (marker) {
                    google.maps.event.clearListeners(marker, 'click');
                    google.maps.event.addListener(marker, 'click', function () {
                        _this.cleanSelection();
                        _this.addSelection(marker);

                        console.log('googleMaps:markerClick:normal ->');
                        _this.rootScope.$broadcast('googleMaps:markerClick:normal', marker._id);
                    });
                });
            } else if (state == 1 /* selectLights */) {
                this.cleanSelection();
                this.markers.forEach(function (marker) {
                    google.maps.event.clearListeners(marker, 'click');
                    google.maps.event.addListenerOnce(marker, 'click', function () {
                        _this.addSelection(marker);

                        console.log('googleMaps:markerClick:selectLights ->');
                        _this.rootScope.$broadcast('googleMaps:markerClick:selectLights', marker._id);
                    });
                });
            } else if (state == 2 /* disable */) {
                this.cleanSelection();
                this.markers.forEach(function (marker) {
                    google.maps.event.clearListeners(marker, 'click');
                });
            }
        };
        return GoogleMapsCtrl;
    })();
    googleMaps.GoogleMapsCtrl = GoogleMapsCtrl;

    var Marker = (function (_super) {
        __extends(Marker, _super);
        function Marker() {
            _super.apply(this, arguments);
        }
        return Marker;
    })(google.maps.Marker);
    googleMaps.Marker = Marker;
})(googleMaps || (googleMaps = {}));
var googleMaps;
(function (googleMaps) {
    function googleMapsDrt() {
        return {
            restrict: 'E',
            template: '<div id="map_canvas" ng-controller="GoogleMapsCtrl"></div>'
        };
    }
    googleMaps.googleMapsDrt = googleMapsDrt;
})(googleMaps || (googleMaps = {}));
var googleMaps;
(function (googleMaps) {
    angular.module('googleMaps', ['global']).controller('GoogleMapsCtrl', googleMaps.GoogleMapsCtrl).directive('googleMaps', googleMaps.googleMapsDrt);
})(googleMaps || (googleMaps = {}));
var groupEditor;
(function (groupEditor) {
    var GroupEditorCtrl = (function () {
        function GroupEditorCtrl($scope, $rootScope, groupService) {
            var _this = this;
            this.$scope = $scope;
            $scope.show = false;

            $scope.confirm = function () {
                var lightIdArr = [];

                if ($scope.lights) {
                    $scope.lights.forEach(function (value) {
                        lightIdArr.push(value._id);
                    });
                }

                var data = {
                    name: $scope.group.name,
                    lights: lightIdArr
                };

                groupService.create(data, function (res) {
                    console.log('create group success: ' + res.name);
                    groupService.fetch();

                    $scope.show = false;
                    $scope.lights = null;
                    $scope.group = null;

                    console.log('groupEditor:confirm ->');
                    $rootScope.$broadcast('groupEditor:confirm');
                });
            };

            $scope.addLights = function () {
                $scope.show = false;

                console.log('groupEditor:addLights ->');
                $rootScope.$broadcast('groupEditor:addLights', $scope.lights);
            };

            $scope.$on('sideBar:newGroup', function (event) {
                console.log('-> groupEditor:newGroup');
                $scope.show = true;
            });

            $scope.$on('selection:confirm', function (event, lights) {
                console.log('-> groupEditor:confirm');
                console.log(lights);
                $scope.show = true;
                $scope.lights = lights;
            });

            $scope.$on('windowAdmin:closeRight', function (event, name) {
                if (name != 'groupEditor')
                    _this._closeWin();
            });
        }
        GroupEditorCtrl.prototype._closeWin = function () {
            this.$scope.show = false;
        };
        return GroupEditorCtrl;
    })();
    groupEditor.GroupEditorCtrl = GroupEditorCtrl;
})(groupEditor || (groupEditor = {}));
var groupEditor;
(function (groupEditor) {
    var config = configuration.groupEditor;

    function groupEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
            }
        };
    }
    groupEditor.groupEditorDirective = groupEditorDirective;
})(groupEditor || (groupEditor = {}));
var groupEditor;
(function (groupEditor) {
    angular.module('groupEditor', ['global']).directive('groupEditor', groupEditor.groupEditorDirective).controller('groupEditorCtrl', groupEditor.GroupEditorCtrl);
})(groupEditor || (groupEditor = {}));
var groupMonitor;
(function (groupMonitor) {
    var GroupMonitorCtrl = (function () {
        function GroupMonitorCtrl($scope, $rootScope, groupService, schedulerService, windowAdmin) {
            var _this = this;
            this._winName = 'groupMonitor';
            this.$scope = $scope;
            $scope.show = false;

            $scope.rgb = [0, 0, 0];
            $scope.newRgb = [0, 0, 0];

            $scope.control = function () {
                groupService.control($scope._id, $scope.newRgb, function (rgb) {
                    console.log(rgb);
                    $scope.rgb = rgb;
                });
            };

            $scope.sClick = function (schedulerId) {
                console.log(schedulerId);

                console.log('groupMonitor:sClick');
                $rootScope.$broadcast('groupMonitor:sClick', schedulerId);
            };

            $scope.$watch('rgb', function (newValue, oldValue) {
                var textColor;
                var rgb = $scope.rgb;

                if ((rgb[0] + rgb[1] + rgb[2]) > 382)
                    textColor = 'black';
                else
                    textColor = 'white';

                $scope.header = {
                    'background-color': 'rgb(' + newValue[0] + ', ' + newValue[1] + ', ' + newValue[2] + ')',
                    'color': textColor
                };
            });

            var multEvents = ['sideBar:groupClick', 'lightMonitor:goToGroup'];
            multEvents.forEach(function (value) {
                $scope.$on(value, function (event, _id) {
                    console.log('sideBar:groupClick');
                    var group = groupService.find(_id);
                    $scope._id = group._id;
                    $scope.name = group.name;
                    $scope.lights = group.lights;
                    $scope.rgb = group.rgb;
                    $scope.scheduler = schedulerService.find(group.sid);

                    $scope.show = true;
                });
            });

            $scope.$on('windowAdmin:closeRight', function (event, name) {
                if (name != 'groupMonitor')
                    _this._closeWin();
            });

            $scope.$watch('show', function (newValue, oldValue, scope) {
                if (newValue)
                    windowAdmin.closeRight(_this._winName);
            });
        }
        GroupMonitorCtrl.prototype._closeWin = function () {
            this.$scope.show = false;
        };
        return GroupMonitorCtrl;
    })();
    groupMonitor.GroupMonitorCtrl = GroupMonitorCtrl;
})(groupMonitor || (groupMonitor = {}));
var groupMonitor;
(function (groupMonitor) {
    var config = configuration.groupMonitor;

    function groupMonitorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
            }
        };
    }
    groupMonitor.groupMonitorDirective = groupMonitorDirective;
})(groupMonitor || (groupMonitor = {}));
var groupMonitor;
(function (groupMonitor) {
    angular.module('groupMonitor', ['global']).directive('groupMonitor', groupMonitor.groupMonitorDirective).controller('groupMonitorCtrl', groupMonitor.GroupMonitorCtrl);
})(groupMonitor || (groupMonitor = {}));
var sideBar;
(function (_sideBar) {
    var config = configuration.sideBar;

    function sideBarDrt() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
                var sideBar = element.find('.sideBar');
                var sideBarElem = sideBar.get(0);

                sideBarElem.addEventListener('mousewheel', function (ev) {
                    var top = sideBar.offset().top;
                    var windowHeight = $(window).height();
                    var sideBarHeight = sideBar.height();
                    var computedTop = top + ev.wheelDelta / 4;

                    if ((computedTop >= windowHeight - sideBarHeight - 100) && (computedTop <= 0))
                        sideBar.css('top', computedTop);
                });
            }
        };
    }
    _sideBar.sideBarDrt = sideBarDrt;
})(sideBar || (sideBar = {}));
var sideBar;
(function (sideBar) {
    var config = configuration.sideBar;

    var SideBarCtrl = (function () {
        function SideBarCtrl($scope, groupService, $rootScope) {
            var _this = this;
            this.$scope = $scope;
            this.groupService = groupService;

            $scope.groupStyle = {};
            $scope.visible = true;

            var colors = ['red', 'darkorange', 'goldenrod', 'green', 'teal', 'blue', 'purple', 'deepskyblue'];

            var random = function (max) {
                return Math.round(Math.random() * max);
            };

            $scope.headerStyle = {
                'background-color': colors[random(colors.length - 1)]
            };

            setInterval(function () {
                $scope.headerStyle = {
                    'background-color': colors[random(colors.length - 1)]
                };
                $scope.$apply();
            }, config.headerChangeTime);

            $scope.groups = groupService.fetch(function (groups) {
                $scope.groups = groups;
                _this._setGroupRgb();
            });

            $scope.menuOptions = [
                [
                    'Buy', function ($itemScope) {
                        console.log($itemScope);
                    }],
                null,
                [
                    'Sell', function ($itemScope) {
                        console.log($itemScope);
                    }]
            ];

            $scope.lightMenu = [
                [
                    '새로운 가로등', function ($itemScope) {
                        console.log($itemScope);
                    }]
            ];

            $scope.groupMenu = [
                [
                    '편집', function ($itemScope) {
                        console.log($itemScope);
                    }]
            ];

            $scope.lightClick = function (_id) {
                $rootScope.$broadcast('sideBar:lightClick', _id);
            };

            $scope.groupClick = function (_id) {
                console.log('sideBar:groupClick');
                $rootScope.$broadcast('sideBar:groupClick', _id);
            };

            $scope.newLight = function () {
                console.log('sideBar:newLight');

                _this._setDisability(true);
                $rootScope.$broadcast('sideBar:newLight');
            };

            $scope.newGroup = function () {
                console.log('sideBar:newGroup ->');
                $rootScope.$broadcast('sideBar:newGroup');
            };

            $scope.$on('groupService:rgbChanged', function (event, _id, rgb) {
                _this._setGroupRgb(_id);
            });

            $scope.$on('windowAdmin:closeLeft', function (event, name) {
                _this._setDisability(true);
            });

            $scope.$on('lightEditor:finished', function (event) {
                _this._setDisability(false);
            });
        }
        SideBarCtrl.prototype._setGroupRgb = function (_id) {
            var _this = this;
            var changedGroups = [];

            if (_id) {
                changedGroups.push(this.groupService.find(_id));
            } else {
                changedGroups = this.$scope.groups;
            }

            changedGroups.forEach(function (group) {
                var textColor;
                var rgb = group.rgb;

                if ((rgb[0] + rgb[1] + rgb[2]) > 382)
                    textColor = 'black';
                else
                    textColor = 'white';

                _this.$scope.groupStyle[group._id] = {
                    'background-color': 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                    'color': textColor
                };
            });
        };

        SideBarCtrl.prototype._setDisability = function (isDisabled) {
            if (isDisabled)
                this.$scope.visible = false;
            else
                this.$scope.visible = true;
        };
        return SideBarCtrl;
    })();
    sideBar.SideBarCtrl = SideBarCtrl;
})(sideBar || (sideBar = {}));
var sideBar;
(function (sideBar) {
    angular.module('sideBar', ['global']).controller('SideBarCtrl', sideBar.SideBarCtrl).directive('sideBar', sideBar.sideBarDrt);
})(sideBar || (sideBar = {}));
var lightMonitor;
(function (lightMonitor) {
    var LightMonitorCtrl = (function () {
        function LightMonitorCtrl($scope, $rootScope, lightService, groupService, windowAdmin) {
            var _this = this;
            this._winName = 'lightMonitor';
            $scope.show = false;
            $scope.rgb = [0, 0, 0];
            $scope.newRgb = [0, 0, 0];

            $scope.control = function () {
                $scope.light.control($scope.newRgb, function (res) {
                    $scope.rgb = $scope.newRgb;
                });
            };

            $scope.edit = function () {
                $rootScope.$broadcast('lightMonitor:editLight', $scope.light);
            };

            $scope.goToGroup = function () {
                windowAdmin.closeRight();

                $rootScope.$broadcast('lightMonitor:goToGroup', $scope.light.gid);
            };

            $scope.btnClose = function () {
                $scope.show = false;
            };

            $scope.$watch('light.rgb', function (newValue, oldValue) {
                if ($scope.light) {
                    var textColor;
                    var rgb = newValue;

                    if ((rgb[0] + rgb[1] + rgb[2]) > 382)
                        textColor = 'black';
                    else
                        textColor = 'white';

                    $scope.header = {
                        'background-color': 'rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')',
                        'color': textColor
                    };
                }
            });

            $scope.$watch('show', function (newValue, oldValue, scope) {
                if (newValue)
                    windowAdmin.closeRight(_this._winName);
            });

            $scope.$on('sideBar:lightClick', function (event, _id) {
                $scope.light = lightService.find(_id);
                $scope.group = groupService.find($scope.light.gid);
                $scope.show = true;
            });

            $scope.$on('googleMaps:markerClick:normal', function (event, _id) {
                console.log('-> lightMonitor:markerClick:normal:' + _id);
                $scope.light = lightService.find(_id);
                $scope.group = groupService.find($scope.light.gid);
                $scope.show = true;
                $scope.$apply();
            });

            $scope.$on('windowAdmin:closeRight', function (event, name) {
                if (name != _this._winName)
                    $scope.show = false;
            });
        }
        return LightMonitorCtrl;
    })();
    lightMonitor.LightMonitorCtrl = LightMonitorCtrl;
})(lightMonitor || (lightMonitor = {}));
var lightMonitor;
(function (lightMonitor) {
    var config = configuration.lightMonitor;

    function lightMonitorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
            }
        };
    }
    lightMonitor.lightMonitorDirective = lightMonitorDirective;
})(lightMonitor || (lightMonitor = {}));
var lightMonitor;
(function (lightMonitor) {
    angular.module('lightMonitor', ['global']).controller('lightMonitorCtrl', lightMonitor.LightMonitorCtrl).directive('lightMonitor', lightMonitor.lightMonitorDirective);
})(lightMonitor || (lightMonitor = {}));
var topAlert;
(function (_topAlert) {
    var config = configuration.topAlert;

    function topAlertDrt() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
                var topAlert = element.find('.topAlert');

                var winWidth = $(window).width();
                var eleWidth = topAlert.width();
            }
        };
    }
    _topAlert.topAlertDrt = topAlertDrt;
})(topAlert || (topAlert = {}));
var topAlert;
(function (topAlert) {
    var TopAlertCtrl = (function () {
        function TopAlertCtrl($scope, lightService, $rootScope) {
            var _this = this;
            var templates = {
                newLightInfo: 'newLightInfo',
                newLightConfirm: 'newLightConfirm',
                addLights: 'addLights'
            };

            $scope.newLightConfirm = function () {
                $scope.template = null;

                console.log('topAlert:createLight');
                $rootScope.$broadcast('topAlert:createLight', _this.newMarker);
            };

            $scope.$on('googleMaps:newLightInfo', function () {
                $scope.template = templates.newLightInfo;
            });

            $scope.$on('googleMaps:newLightConfirm', function (event, newMarker) {
                $scope.template = templates.newLightConfirm;
                $scope.$apply();
                _this.newMarker = newMarker;
            });

            $scope.$on('groupEditor:addLights', function (event) {
                console.log('-> topAlert:addLights');
                $scope.template = templates.addLights;
            });

            $scope.$on('selection:confirm', function (event) {
                console.log('-> topAlert:confirm');
                $scope.template = null;
            });
        }
        return TopAlertCtrl;
    })();
    topAlert.TopAlertCtrl = TopAlertCtrl;
})(topAlert || (topAlert = {}));
var topAlert;
(function (topAlert) {
    angular.module('topAlert', []).directive('topAlert', topAlert.topAlertDrt).controller('topAlertCtrl', topAlert.TopAlertCtrl);
})(topAlert || (topAlert = {}));
var selection;
(function (selection) {
    var SelectionCtrl = (function () {
        function SelectionCtrl($scope, $rootScope, lightService) {
            $scope.lights = [];

            $scope.confirm = function () {
                console.log('selection:confirm ->');
                $rootScope.$broadcast('selection:confirm', $scope.lights);

                $scope.show = false;
                $scope.lights = [];
            };

            $scope.deselect = function (light) {
                var index = $scope.lights.indexOf(light);
                $scope.lights.splice(index, 1);

                console.log('selection:deselect ->');
                $rootScope.$broadcast('selection:deselect', light._id);
            };

            $scope.$on('groupEditor:addLights', function (event, lights) {
                console.log('-> selection:addLights');
                if (lights)
                    $scope.lights = lights;
                $scope.show = true;
            });

            $scope.$on('googleMaps:markerClick:selectLights', function (event, _id) {
                console.log('-> selection:markerClick:selectLights:' + _id);
                $scope.lights.push(lightService.find(_id));
                $scope.$apply();
            });
        }
        return SelectionCtrl;
    })();
    selection.SelectionCtrl = SelectionCtrl;
})(selection || (selection = {}));
var selection;
(function (selection) {
    var config = configuration.selection;

    function selectionDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
            }
        };
    }
    selection.selectionDirective = selectionDirective;
})(selection || (selection = {}));
var selection;
(function (selection) {
    angular.module('selection', []).controller('selectionCtrl', selection.SelectionCtrl).directive('selection', selection.selectionDirective);
})(selection || (selection = {}));
var scheduler;
(function (scheduler) {
    var config = configuration.scheduler;

    function schedulerDrt() {
        var rtn = {
            replace: false,
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, instanceElement, instanceAttributes) {
            }
        };

        return rtn;
    }
    scheduler.schedulerDrt = schedulerDrt;
})(scheduler || (scheduler = {}));
var scheduler;
(function (scheduler) {
    var SchedulerCtrl = (function () {
        function SchedulerCtrl(schedulerService, $scope, $rootScope) {
            var _this = this;
            $scope.show = false;

            $scope.newEvent = function () {
                $rootScope.$broadcast('scheduler:newEvent');
            };

            $scope.$on('groupMonitor:sClick', function (event, schedulerId) {
                console.log('scheduler:sClick:' + schedulerId);

                $scope.scheduler = schedulerService.find(schedulerId);
                _this.events = $scope.scheduler.daily;
                _this.redraw();

                $scope.show = true;
            });

            $scope.$on('eventEditor:insertEvent', function (event, newEvent) {
                var daily = {
                    rgb: newEvent.rgb,
                    date: newEvent.date,
                    h: newEvent.date.getHours(),
                    m: newEvent.date.getMinutes()
                };

                $scope.scheduler.insertDaily(daily, function () {
                    _this.events = $scope.scheduler.daily;
                    _this.redraw();
                });
            });
        }
        SchedulerCtrl.prototype.redraw = function () {
            if (this.svg)
                this.svg.remove();
            this.draw();
        };

        SchedulerCtrl.prototype.draw = function () {
            var _this = this;
            var select = $('.scheduler main .left');
            var width = select.width();
            var height = select.height();

            var xAxisPadding = 100;

            var xScale = d3.time.scale().domain([new Date().setHours(0, 0, 0), new Date().setHours(23, 59, 59)]).rangeRound([0, width]);

            var yScale = d3.scale.linear().domain([0, 255]).rangeRound([0, height]);

            var svg = d3.select('.scheduler main .left').append("svg").attr("width", width).attr("height", height);

            this.svg = svg;

            svg.selectAll("rect").data(this.events).enter().append("rect").attr("x", function (d, i) {
                return xScale(d.date);
            }).attr("y", 0).attr("width", function (d, i) {
                var nextD = _this.events[i + 1];

                if (nextD)
                    return xScale(nextD.date) - xScale(d.date);
                else
                    return width - xScale(d.date);
            }).attr("height", height).attr("fill", function (d) {
                return 'rgb(' + d.rgb[0] + ', ' + d.rgb[1] + ', ' + d.rgb[2] + ')';
            });

            var xAxis = d3.svg.axis().scale(xScale).ticks(d3.time.hour).tickFormat(d3.time.format('%H시')).orient('bottom');

            svg.append('g').attr('class', 'axis').attr('transform', 'translate(0, ' + (height - xAxisPadding) + ')').call(xAxis);
        };
        return SchedulerCtrl;
    })();
    scheduler.SchedulerCtrl = SchedulerCtrl;
})(scheduler || (scheduler = {}));
var scheduler;
(function (scheduler) {
    var EventEditorCtrl = (function () {
        function EventEditorCtrl($scope, $modal, $rootScope) {
            $scope.show = false;

            $scope.cancel = function () {
                console.log('event edit canceled');
                $scope.show = false;
            };

            $scope.$on('scheduler:newEvent', function (event) {
                $scope.date = new Date();

                $scope.rgb = [255, 255, 255];

                $modal.open();

                $modal.addOnClick(function () {
                    $scope.show = false;
                    $scope.$apply();

                    var data = {
                        rgb: $scope.rgb,
                        date: $scope.date
                    };
                    $rootScope.$broadcast('eventEditor:insertEvent', data);
                });

                $scope.show = true;
            });
        }
        return EventEditorCtrl;
    })();
    scheduler.EventEditorCtrl = EventEditorCtrl;
})(scheduler || (scheduler = {}));
var scheduler;
(function (scheduler) {
    var config = configuration.scheduler;

    function eventEditorDrt() {
        var rtn = {
            replace: true,
            restrict: 'E',
            templateUrl: config.eventEditor.templateUrl,
            link: function (scope, elem, instanceAttributes) {
            }
        };

        return rtn;
    }
    scheduler.eventEditorDrt = eventEditorDrt;
})(scheduler || (scheduler = {}));
var scheduler;
(function (scheduler) {
    angular.module('scheduler', ['global', 'ui.bootstrap']).directive('scheduler', scheduler.schedulerDrt).directive('eventEditor', scheduler.eventEditorDrt).controller('schedulerCtrl', scheduler.SchedulerCtrl).controller('eventEditorCtrl', scheduler.EventEditorCtrl).run(function () {
    });
})(scheduler || (scheduler = {}));
var modules = [
    'googleMaps',
    'global',
    'sideBar',
    'lightMonitor',
    'topAlert',
    'lightEditor',
    'groupMonitor',
    'groupEditor',
    'selection',
    'scheduler'
];

angular.module('app', modules).run(function ($window) {
});
var lightEditor;
(function (lightEditor) {
    var config = configuration.lightEditor;

    function lightEditorDirective() {
        return {
            restrict: 'E',
            templateUrl: config.templateUrl,
            link: function (scope, element, attr) {
            }
        };
    }
    lightEditor.lightEditorDirective = lightEditorDirective;
})(lightEditor || (lightEditor = {}));
var lightEditor;
(function (lightEditor) {
    var Light = global.Light;

    var LightEditorCtrl = (function () {
        function LightEditorCtrl($scope, groupService, lightService, $rootScope, windowAdmin) {
            var _this = this;
            this._winName = 'lightEditor';
            this.$rootScope = $rootScope;
            this.$scope = $scope;
            this.windowAdmin = windowAdmin;

            $scope.show = false;

            $scope.groups = groupService.fetch();
            $scope.light = new Light();

            $scope.confirm = function () {
                if ($scope.light._id) {
                    $scope.light.update(function (res) {
                        console.log(res);
                    });
                } else {
                    lightService.create($scope.light, function (res) {
                        groupService.fetch();
                        _this._finished();
                    });
                }
            };

            $scope.btnClose = function () {
                _this._finished();
            };

            $scope.$on('topAlert:createLight', function (event, newMarker) {
                console.log('lightEditor:createLight');

                $scope.light = new Light();
                $scope.light.lat = newMarker.getPosition().lat();
                $scope.light.lng = newMarker.getPosition().lng();
                $scope.show = true;
            });

            $scope.$on('googleMaps:newMarkerPositionChanged', function (event, newMarker) {
                $scope.light.lat = newMarker.getPosition().lat();
                $scope.light.lng = newMarker.getPosition().lng();
                $scope.$apply();
            });

            $scope.$on('lightMonitor:editLight', function (event, light) {
                $scope.light = light;

                windowAdmin.closeRight(_this._winName);

                $scope.show = true;
            });
        }
        LightEditorCtrl.prototype._finished = function () {
            this.$rootScope.$broadcast('lightEditor:finished');
            this.$scope.show = false;
        };
        return LightEditorCtrl;
    })();
    lightEditor.LightEditorCtrl = LightEditorCtrl;
})(lightEditor || (lightEditor = {}));
var lightEditor;
(function (lightEditor) {
    angular.module('lightEditor', ['global']).directive('lightEditor', lightEditor.lightEditorDirective).controller('lightEditorCtrl', lightEditor.LightEditorCtrl);
})(lightEditor || (lightEditor = {}));
