﻿namespace xeModule.Controllers {
    
    export class BarcodeCtrl {
        static $inject = ["$routeParams", "XeApiSvc"];
        constructor(routeParams: ng.route.IRouteParamsService, private api: Services.XeApiSvc) {
            var e = routeParams["id"] || 1121  //$scope.dialogOptions.currentNode.id.split("|");
            this.currEvent = {
                eventId: +e[0] || 0,
                title: e[1] || "",
                maxSubscriptions: +e[2] || 0,
                subscriptionLimit: +e[3] || 0
            }
            //call service to get all subscriptions
            api.getEventSubscriptions(this.currEvent.eventId).then(data => this.subscriptions = data);
        }

        public subscriptions: Models.ISubscription[];
        public currEvent: { eventId: number, title: string, maxSubscriptions: number, subscriptionLimit: number}
        public barcode(id) {
            var code39 = String(id);
            while (code39.length < 6) {
                code39 = "0" + code39;
            }
            return code39;
        }

        public print() {
            document.body.classList.add("PrintNO");
            window.print();
            document.body.classList.remove("PrintNO");
        }
    }
}