namespace xeModule.Directives {
    export function xeCounter(): ng.IDirective {
        return ngUtils.makeComponent({
            inputs: ["data","max","limit"],
            outputs: [],
            controller: "xeCounterCtrl",
            template: `
<div class="row-fluid">
    <div class="span3 offset1"><b>Iscritti: {{ctrl.tot}}</b> <i>/ {{ctrl.max}}</i></div>
    <div class="span3 offset1"><b>Confermati: {{ctrl.conf}}</b> <i>/ {{ctrl.limit}}</i></div>
    <div class="span3 offset1"><b>Presenti: {{ctrl.pres}}</b> <i>/ {{ctrl.conf}}</i></div>
</div>
`       })
    }
}

namespace xeModule.Controllers {
    export class xeCounterCtrl {
        constructor() {
        }
        
        public max: number;
        public limit: number;
        public set data(value: Models.ISubscription[]) {
            if (value) {
                this.tot = value.length;
                this.conf = value.filter(s => s.IsConfirmed).length;
                this.pres = value.filter(s => s.IsPresent).length;
            } else {
                this.tot = 0;
                this.conf = 0;
                this.pres = 0;
            }
        }

        protected tot: number;
        protected conf: number;
        protected pres: number;
    }
}
