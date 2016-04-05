namespace xeModule.Directives {
    export function xeFilter(VIEWDIR:string): ng.IDirective {
        return ngUtils.makeComponent({
            inputs: [],
            outputs: ["onFilter", "onRefresh"],
            controller: "xeFilterCtrl",
            template: VIEWDIR + "xefilter.html"
        });
    }
    xeFilter.$inject = ["XECUSTOM_VIEWDIR"];
}

namespace xeModule.Controllers {
    export class xeFilterCtrl {
        constructor() {
            this._filter = {}
        }

        public onRefresh: Models.IEventHandler<any>;
        public onFilter: Models.IEventHandler<any>;

        
        private _filter: { $?: string, IsConfirmed?: boolean, IsPresent?: boolean };
        protected setFilter($event: ng.IAngularEvent, flt: string) {
            if ($event && $event.preventDefault) $event.preventDefault();
            switch (Number(flt)) {
                case -3:
                    this._filter.IsPresent = true;
                    delete this._filter.IsConfirmed;
                    break;
                case -2:
                    this._filter.IsConfirmed = true;
                    delete this._filter.IsPresent;
                    break;
                case -1:
                    delete this._filter.IsConfirmed;
                    delete this._filter.IsPresent;
                    break;
                default:
                    this._filter.$ = flt
            }
            this.onFilter({ $event: this._filter });
        }

        protected getFilterType(): string {
            if (this._filter.IsPresent) {
                return 'Solo presenti';
            } else if (this._filter.IsConfirmed) {
                return 'Solo confermati';
            } else {
                return 'Tutti iscritti';
            }
        }
    }
}