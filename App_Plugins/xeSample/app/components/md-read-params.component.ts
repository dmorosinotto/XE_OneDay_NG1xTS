import {Component, Input, Inject, OnChanges, SimpleChange, ViewChild} from "ng-metadata/core";
import { mdEventStoreDirective } from "./md-event-store.directive"
interface Changes {
    [key: string]: SimpleChange;
    data: SimpleChange;
    async: SimpleChange;
}

@Component({
    selector: "md-read-params",
    template: `
        <h2>Param read: {{$ctrl.id}}</h2>
        <pre>
            DATA = {{$ctrl.data | json}}
            ASYNC = {{$ctrl.async | json}}
        </pre>
        <button ng-click="$ctrl.store.loadData()">RELOAD</button>
        <img src="http://preloaders.net/preloaders/712/Floating%20rays.gif" ng-show="spin"></img>
        <ul><li ng-repeat="s in $ctrl.store.subscriptions" > {{s.Name}} {{s.Surname}} - {{s.Email}} </li></ul>
        <md-event-store route-param-id="$ctrl.id" on-loaded="spin=!$event; $ctrl.loading($event)"></md-event-store>
    `
})
export class mdReadParamsComponent implements OnChanges {
    constructor(
        @Inject('$routeParams')rp: angular.route.IRouteParamsService
    ) {
        this.id = rp["id"];
    }
    
    public id: string;
    @Input("<") public data: any;
    @Input("<") public async: any;
    
    ngOnChanges(changes: Changes): any {
        if (changes.async) console.log(new Date().getMilliseconds(), "async CHANGE:", changes.async.currentValue, changes.async.previousValue);
    }
    
    @ViewChild(mdEventStoreDirective) store: mdEventStoreDirective 
    loading(e){
        console.info("SHOW LOADED EVENT:",e);
        
    } 
    
}