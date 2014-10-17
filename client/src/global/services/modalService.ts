module global {
    export class ModalService {
        $compile: ng.ICompileService;
        $rootScope: ng.IRootScopeService;
        $timeout: ng.ITimeoutService;

        onClickCbs: Function[];

        constructor($compile: ng.ICompileService, $rootScope, $timeout) {
            this.$compile = $compile;
            this.$rootScope = $rootScope;
            this.$timeout = $timeout;

            this.onClickCbs = [];
        }

        open(): void {
            var backdropScope = this.$rootScope.$new(true);
            var backdropElem = this.$compile('<modal-backdrop></modal-backdrop>')(backdropScope);
            $('body').append(backdropElem);

            // waiting for appending finished
            setTimeout(() => {
                backdropElem.addClass('show');
                // when modal backdrop clicked, close it and call callbacks
                // instances that use modal service should register onClickListener
                backdropElem.on('click', () => {
                    // call callbacks
                    while (this.onClickCbs.length)
                        this.onClickCbs.pop()();
                    // close modal backdrop
                    this.close();
                });
            }, 100);
        }

        close(): void {
            var elems = $('.modalBackdrop').removeClass('show');
            
            this.$timeout(() => {
                elems.remove();
            }, 1200);
        }

        addOnClick(callback: Function) {
            this.onClickCbs.push(callback);
        }
    }
}