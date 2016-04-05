namespace xeModule.Services {
    export class MsgboxSvc {
    static $inject = ["notificationsService"]
        constructor(private notif: umbraco.services.INotificationsService) {
        }

        public showAlert(msg: string | Object, title: string = "OK") {
            if (typeof msg === "string") {
                this.show(msg, title, "success");
            } else {
                this.show(JSON.stringify(msg), title, "success");
            }
        }

        public showResult(msg: string | Object, title: string, success: boolean = true) {
            if (typeof msg === "string") {
                this.show(msg, title || (success ? "Ritornato" : "Attenzione"), success ? "info" : "warning");
            } else {
                this.show(JSON.stringify(msg), title || (success ? "Ritornato" : "Attenzione"), success ? "info" : "warning");
            }
        }
        
        public showError(msg: string | Object, title: string = "ERR") {
            if (typeof msg === "string") {
                this.show(msg, title, "error");
            } else {
                this.show(JSON.stringify(msg), title, "error");
            }
        }
        
        private show(msg: string, title: string, method: "success" | "error" | "info" | "warning") {
            this.notif[method](title, msg);
        }
    }
}