module global {
    /*
     * Angular factory service for windows (e.g. light-monitor, group-monitor)
     * To keep opened window one
     */
    export class WindowAdminService {
        $rootScope: ng.IRootScopeService;

        constructor($rootScope) {
            this.$rootScope = $rootScope;
        }
        /**
         * close other right windows except <name>
         */
        closeRight(name?: string): void {
            if (name == undefined)
                name = '';
            // windowAdmin -> group-editor, group-monitor, light-editor, light-monitor
            this.$rootScope.$broadcast('windowAdmin:closeRight', name);
        }

        closeAll(name: string): void {
            // windowAdmin -> group-editor, group-monitor, light-editor, light-monitor
            this.$rootScope.$broadcast('windowAdmin:closeRight', name);
            // windowAdmin -> side-bar
            this.$rootScope.$broadcast('windowAdmin:closeLeft', name);
        }
    }
} 