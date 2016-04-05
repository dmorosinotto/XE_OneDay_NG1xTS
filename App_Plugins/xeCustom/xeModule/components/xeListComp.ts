namespace xeModule.Directives {
    export function xeList(): ng.IDirective {
        return ngUtils.makeComponent({
            inputs: ["data", "currFilter"],
            outputs: ["onDelete","onBarcode","onEmail","onCheck"],
            controller: "xeListCtrl",
            template: `
<table class="table">
    <thead>
        <tr>
            <td>Nome</td>
            <td>Cognome</td>
            <td>Email</td>
            <td>Citt&agrave;</td>
            <td>Azioni</td>
        </tr>
    </thead>
    <tbody>
        <tr ng-repeat="s in ctrl.data | filter: ctrl.currFilter :strict | orderBy: 'Name'" 
            ng-class="{error: (!s.IsConfirmed && !s.IsPresent), success: s.IsPresent}">
            <td><b>{{s.Name}}</b></td>
            <td><b>{{s.Surname}}</b></td>
            <td>{{s.Email}}</td>
            <td>{{s.City}}</td>
            <td>
                <button class="btn btn-small" ng-click="ctrl.onDelete({$event:s})"><i class="icon-trash"></i></button>
                <button class="btn btn-small" ng-click="ctrl.onBarcode({$event:s})"><i class="icon-barcode"></i></button>
                <button class="btn btn-small" ng-click="ctrl.onEmail({$event:s})"><i class="icon-message"></i></button>
                <button class="btn btn-small" ng-click="ctrl.onCheck({$event:s})"><i ng-class="s.IsPresent ? 'icon-checkbox' : 'icon-checkbox-empty'"></i></button>
            </td>
        </tr>
    </tbody>
</table>
`       });
    }
}

namespace xeModule.Controllers {
    export class xeListCtrl {
        constructor() {
        }

        public data: Models.ISubscription[];
        public currFilter: any;
        public onDelete: Models.IEventHandler<Models.ISubscription>;
        public onBarcode: Models.IEventHandler<Models.ISubscription>;
        public onEmail: Models.IEventHandler<Models.ISubscription>;
        public onCheck: Models.IEventHandler<Models.ISubscription>;
    }
}