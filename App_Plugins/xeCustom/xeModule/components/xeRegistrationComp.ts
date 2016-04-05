namespace xeModule.Directives {
    export function xeRegistration(): ng.IDirective {
        return ngUtils.makeComponent({
            inputs: ["eventid"],
            outputs: ["onRegistration"],
            controller: "xeRegistrationCtrl",
            template: '<button class="btn" ng-click="ctrl.modalRegister()">Nuova Registrazione</button>'
        });
    }
}

namespace xeModule.Controllers {
    export class xeRegistrationCtrl {
        static $inject = ["XeApiSvc", "MsgboxSvc", "dialogService", "XECUSTOM_VIEWDIR"];
        constructor(private api: Services.XeApiSvc, private msg: Services.MsgboxSvc, private dialog: umbraco.services.IDialogService, private VIEWDIR: string) {
        }
        public eventid: number;
        public onRegistration: Models.IEventHandler<Models.ISubscription>;

        protected modalRegister() {
            this.dialog.open({
                iframe: false,
                template: this.VIEWDIR + "xeregistration.html",
                dialogData: {
                    EventId: this.eventid,
                    Privacy: true
                },
                callback: (r: Models.IRegistration) => {
                    if (r) {
                        this.api.newSubscription(r)
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
                                if (s) this.onRegistration({ $event: s });
                            });
                    }
                }
            });
        }
    }
}