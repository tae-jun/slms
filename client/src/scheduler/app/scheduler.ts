/// <reference path="../directives/schedulerdrt.ts" />
/// <reference path="../controllers/schedulerctrl.ts" />
/// <reference path="../controllers/eventeditorctrl.ts" />
/// <reference path="../directives/eventeditordrt.ts" />
module scheduler {
    angular.module('scheduler', ['global', 'ui.bootstrap'])
        .directive('scheduler', schedulerDrt)
        .directive('eventEditor', eventEditorDrt)
        .controller('schedulerCtrl', SchedulerCtrl)
        .controller('eventEditorCtrl', EventEditorCtrl)
        .run(() => {
            
        });
}