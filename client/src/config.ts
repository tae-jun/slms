module configuration {
    export var global = {
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
    }

    export var sideBar = {
        templateUrl: 'static/sideBar.tpl.html',
        headerChangeTime: 10000
    }

    export var lightMonitor = {
        templateUrl: 'static/lightMonitor.tpl.html'
    }

    export var topAlert = {
        templateUrl: 'static/topAlert.tpl.html'
    }

    export var lightEditor = {
        templateUrl: 'static/lightEditor.tpl.html'
    }

    export var groupEditor = {
        templateUrl: 'static/groupEditor.tpl.html'
    }

    export var selection = {
        templateUrl: 'static/selection.tpl.html'
    }

    export var groupMonitor = {
        templateUrl: 'static/groupMonitor.tpl.html'
    }

    export var scheduler = {
        templateUrl: 'static/scheduler.tpl.html',
        eventEditor: {
            templateUrl: 'static/eventEditor.tpl.html'
        }
    }
}