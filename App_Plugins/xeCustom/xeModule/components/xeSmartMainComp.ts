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
        }


        public currEvent: Models.EventStore;
        public set routeParamId(value: string) {
            if (value) {
                this.currEvent = new Models.EventStore(this.api, this.msg, value);
                this.currEvent.loadData();
            }
        };
    }
}