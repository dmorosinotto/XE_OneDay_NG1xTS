namespace xeModule.Directives {
    export function ngSort(): angular.IDirective {
        return ngUtils.makeComponent({
            EorA:"A",
            inputs:[],
            outputs:[],
            bindings: ["sort:=ngSort"],
            controller: "ngSortCtrl",
            template: undefined
        });
    }
    
    
    export function ngSortby(): angular.IDirective {
        return ngUtils.makeComponent({
            EorA: "A",
            bindings: ["fieldName: @ngSortby"],
            inputs: [],
            outputs: [],
            controller: "ngSortbyCtrl",
            template: "<a ng-click='ctrl.Toggle()'><span ng-transclude></span>&nbsp;<span ng-class='ctrl.css'></span></a>",
            require: "^ngSort",
            transclude: true 
        });
    }
}



namespace xeModule.Controllers {
    export class ngSortCtrl {
        constructor() {
            this.icon = "icon-";
            this.iconAsc = " icon-chevron-up";
            this.iconDesc = " icon-chevron-down";
            this.cols = [];
        }
        
        public sort: string;

        private cols: ngSortbyCtrl[];
        private icon: string;
        private iconAsc: string;
        private iconDesc: string;

        public register(sortby: ngSortbyCtrl) {
            this.cols.push(sortby);
            //setIcon(sortby);
        }

        public sortBy(fieldName: string) {
            this.sort = ("-" + this.sort === "-" + fieldName) ? "-" + fieldName : fieldName;
            this.cols.forEach(col => this.setIcon(col));
        }
        
        private setIcon(col: ngSortbyCtrl) {
            if (col.fieldName === this.sort || "-" + col.fieldName === this.sort) {
                col.css = (this.sort === col.fieldName ? this.iconAsc : this.iconDesc);
            } else {
                col.css = this.icon;
            }   
        }
    }
    
    export class ngSortbyCtrl {
        constructor() { }
        
        public fieldName: string;
        public css: string;
        
        private ngSort: ngSortCtrl;
        
        public OnInit() {
            this.ngSort.register(this);
        }

        protected Toggle() {
            this.ngSort.sortBy(this.fieldName);
        }
    }
}
