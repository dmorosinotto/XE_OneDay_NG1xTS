namespace xeModule.Models {
    export class EventStore {
        constructor(private api: Services.XeApiSvc, private msg: Services.MsgboxSvc, routeParamId: string) {
            var e = routeParamId.split("|");
            this.eventId = Number(e[0]) || 0,
            this.title = e[1] || "",
            this.maxSubscriptions = Number(e[2]) || 10;
            this.subscriptionLimit = Number(e[3]) || this.maxSubscriptions;
            this.subscriptions = [];
        }

        public eventId: number;
        public title: string;
        public maxSubscriptions: number;
        public subscriptionLimit: number;
        public subscriptions: Models.ISubscription[];
        
        public loadData() {
            this.api.getEventSubscriptions(this.eventId)
                .then(data => this.subscriptions = data );
        }

        public delete(s: Models.ISubscription) {
            if (window.confirm("Sei sicuro di voler eliminare l'iscrizione?")) {
                this.api.delSubscription(s.Id)
                    .then(r => {
                        this.msg.showResult(`L'iscrizione di ${s.Name} ${s.Surname} e' stata eliminata!`, "Cancellazione riuscita",r);
                        var idx = this.subscriptions.indexOf(s);
                        this.subscriptions.splice(idx, 1);
                    });
            }
        }

        public toggle(s: Models.ISubscription) {
            this.api.togglePresent(s.Id)
                .then(r => {
                    var idx = this.subscriptions.indexOf(s);
                    this.subscriptions.splice(idx, 1, r);
                });
        }

        public barcode(s: Models.ISubscription) {
            this.api.sendBarcodeEmail(s.Id)
                .then(r => this.msg.showResult(`Barcode inviato via email a ${s.Email}!`, "Email biglietto", r));
        }

        public email(s: Models.ISubscription) {
            this.api.sendConfirmationEmail(s.Id)
                .then(r => this.msg.showResult(`Inviata a ${s.Name} ${s.Surname}!`, "Email conferma", r));
        }
    }
}