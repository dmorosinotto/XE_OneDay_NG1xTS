namespace xeModule.Services {
    export class XeApiSvc {
        static $inject = ["$http", "XECUSTOM_BASEAPI", "MsgboxSvc"];
        constructor(private http: angular.IHttpService, private BASEAPI: string, private msg: MsgboxSvc) {
        }
        
        public getEventSubscriptions(eventId: number): ng.IPromise<Models.ISubscription[]> {
            return this.http.get<Models.ISubscription[]>(this.BASEAPI + "GetEventSubscriptions/" + eventId)
                .then(r => r.data, e => this.logErrorAPI(e));
        }

        public newSubscription(data: Models.IRegistration): ng.IHttpPromise<Models.ISubscription> {
            return this.http.post<Models.ISubscription>(this.BASEAPI + "NewSubscription", data)
        }

        public delSubscription(subscriptionId: number): ng.IPromise<boolean> {
            return this.http.delete<boolean>(this.BASEAPI + "DelSubscription/" + subscriptionId)
                .then(r => (r.status==200), e => { this.logErrorAPI(e); return false });
        }

        public togglePresent(s: Models.ISubscription): ng.IPromise<Models.ISubscription> {
            s.IsPresent = !s.IsPresent;
            return this.http.put<Models.ISubscription>(this.BASEAPI + "TogglePresent/" + s.Id, s)
                .then(r => r.data, e => this.logErrorAPI(e));
        }

        public sendConfirmationEmail(subscriptionId: number): ng.IPromise<boolean> {
            return this.http.post<boolean>(this.BASEAPI + "SendConfirmationEmail/" + subscriptionId, {})
                .then(r => (r.status == 200), e => { this.logErrorAPI(e); return false });
        }

        public sendBarcodeEmail(subscriptionId: number): ng.IPromise<boolean> {
            return this.http.post<boolean>(this.BASEAPI + "SendBarcodeEmail/" + subscriptionId, {})
                .then(r => (r.status == 200), e => { this.logErrorAPI(e); return false });
        }

        private logErrorAPI(e: { status?: number, config?: ng.IRequestConfig }) {
            this.msg.showError("ERROR " + (e.status || ''), `Calling ${e.config.method} ${e.config.url}`);
        }
    }
}