import {Component, Input, Inject, Output, OnChanges, SimpleChange, EventEmitter} from "ng-metadata/core";

type ISubscription = any;
interface Changes {
    [key:string]: SimpleChange;
    routeParamId: SimpleChange;
}

@Component({
    selector: "md-event-store",
    template: "<hr>{{$ctrl.route-param-id}}<pre>{{$ctrl.subscriptions}}</pre></hr>"
})
export class mdEventStoreDirective {
        constructor(
            @Inject('XeApiSvc') private api: any, 
            @Inject('MsgboxSvc') private msg: any,
            @Inject('$timeout') private wait: angular.ITimeoutService) {
            this.subscriptions = [];
            console.log("NEW Store", api, msg);
        }

        @Input ("<") public routeParamId: string;
        @Output() public onLoaded = new EventEmitter<boolean>();
        
        ngOnChanges(changes: Changes) {
            if (changes.routeParamId) {
                console.log("routeParamId CHANGED ---> init", changes.routeParamId.currentValue)
                var e = changes.routeParamId.currentValue.split("|");
                this.eventId = Number(e[0]) || 0,
                this.title = e[1] || "",
                this.maxSubscriptions = Number(e[2]) || 10;
                this.subscriptionLimit = Number(e[3]) || this.maxSubscriptions;
                this.subscriptions = [];
                this.loadData();
            }
        }
        
        
        public eventId: number;
        public title: string;
        public maxSubscriptions: number;
        public subscriptionLimit: number;
        public subscriptions: ISubscription[];
        
        public loadData() {
            console.log("START LOADING");
            this.onLoaded.emit(false);
            this.api.getEventSubscriptions(this.eventId)
                .then(data => {
                    this.subscriptions = data
                    console.log("END LOADING");
                    this.wait(()=>this.onLoaded.emit(true), 1000);
                } );
        }

        public delete(s: ISubscription) {
            if (window.confirm("Sei sicuro di voler eliminare l'iscrizione?")) {
                this.api.delSubscription(s.Id)
                    .then(r => {
                        this.msg.showResult(`L'iscrizione di ${s.Name} ${s.Surname} e' stata eliminata!`, "Cancellazione riuscita",r);
                        var idx = this.subscriptions.indexOf(s);
                        this.subscriptions.splice(idx, 1);
                    });
            }
        }

        public toggle(s: ISubscription) {
            this.api.togglePresent(s)
                .then(r => {
                    var idx = this.subscriptions.indexOf(s);
                    this.subscriptions.splice(idx, 1, r);
                });
        }

        public barcode(s: ISubscription) {
            this.api.sendBarcodeEmail(s.Id)
                .then(r => this.msg.showResult(`Barcode inviato via email a ${s.Email}!`, "Email biglietto", r));
        }

        public email(s: ISubscription) {
            this.api.sendConfirmationEmail(s.Id)
                .then(r => this.msg.showResult(`Inviata a ${s.Name} ${s.Surname}!`, "Email conferma", r));
        }
    }