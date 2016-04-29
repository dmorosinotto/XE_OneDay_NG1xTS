namespace xeModule.Directives {
    export function xeSmartMain(VIEWDIR:string): ng.IDirective {
        return ngUtils.makeComponent({
            inputs: ["routeParamId"],
            outputs: [],
            controller: "xeSmartMainCtrl",
            template: VIEWDIR + "xesmartmain.html"
        });
    }
    xeSmartMain.$inject = ["XECUSTOM_VIEWDIR"];
}

namespace xeModule.Controllers {
    export class xeSmartMainCtrl {
        static $inject = ["XeApiSvc","MsgboxSvc"]
        constructor(private api: Services.XeApiSvc, private msg: Services.MsgboxSvc) {
            this.safeInit();
        }

        protected currEvent: Models.EventStore;

        private _routeParamId: string;
        public set routeParamId(value: string) {
            this._routeParamId = value;
            this.safeInit();
        };
        
        private safeInit() {
            if (this._routeParamId && this.msg && this.api) {
                this.currEvent = new Models.EventStore(this.api, this.msg, this._routeParamId);
                this.currEvent.loadData();
            }
        }
    }
}