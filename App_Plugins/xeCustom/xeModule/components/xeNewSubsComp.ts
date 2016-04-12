namespace xeModule.Directives {
    export function xeNewSubs(VIEWDIR: string): ng.IDirective {
        return ngUtils.makeComponent({
            inputs: ["eventid"],
            outputs: ["onRegistration"],
            controller: "xeNewSubsCtrl",
            template: VIEWDIR + 'xenewsubs.html'
        });
    }
    xeNewSubs.$inject = ["XECUSTOM_VIEWDIR"];
}

namespace xeModule.Controllers {
    export class xeNewSubsCtrl {
        static $inject = ["XeApiSvc", "MsgboxSvc"];
        constructor(private api: Services.XeApiSvc, private msg: Services.MsgboxSvc) {
        }

        public eventid: number;
        public onRegistration: Models.IEventHandler<Models.ISubscription>;

        protected inInsert: boolean;
        protected data: Models.IRegistration;

        protected toggleInsert() {
            //mostra la form di inserimento dati
            this.inInsert = !this.inInsert;
            //initializza il model data con dei valori default (EventId + Privacy=true)
            if (this.inInsert) this.data = {
                Name: "", Surname: "", Email: "", City: "",
                EventId: this.eventid,
                Privacy: true
            };
        }

        protected Cancel() {
            //nasconde la form di inserimento dati
            this.inInsert = false;
        }

        protected Save() {
            alert(JSON.stringify(this.data));
            //chiamata API per salvare i dati sul DB
            this.api.newSubscription(this.data)
                .then(r => r.data,
                (e: { status?: number }) => {
                    if (e.status == 400) { //BAD REQUEST
                        this.msg.showError("Formato dati inviati non valido, controllare che l'Email sia valida !", "ERROR 400");
                    } else if (e.status == 409) { //CONFLICT
                        this.msg.showError("Iscrizione non accettata, esiste gia' una registrazione con questa Email !", "ERROR 409");
                    } else { //SERVER ERRORS
                        this.msg.showError("ERROR " + e.status, "Errore nella iscrizione");
                    }
                })
                .then(s => {
                    if (s) {
                        //nasconde la form inserimento ed emette evento onRegistration per notificare padre dell'avvenuta registrazione
                        this.inInsert = false;
                        this.onRegistration({ $event: s });
                    }
                });
        }
    }
}