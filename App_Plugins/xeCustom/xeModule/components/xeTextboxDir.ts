namespace xeModule.Directives {
    export function xeTextboxDir(): ng.IDirective {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                isReq: '@'
                ,isValid: '='
                ,errMessage: '@'
            },
            template: function(tElement,tAttrs) {
               var name = tAttrs.name || tAttrs.label;
               var type = tAttrs.type || "text";
               //STO TORNANDO UNA FUNZIONE CHE RITORNA DINAMICAMENTE L'HTML CON IL name="xxx" DELL'INPUT ATTUALIZZATO!
               //PERCHE' HO IL PROBLEMA CHE <input name="{{label}}" NON VIENE VALUTATA IN MODO CORRETTO
               //O MEGLIO FORSE VIENE INTERPOLATA TROPPO TARDI E QUESTO CAUSA IL PROBLEMA CHE NG-MODEL 
               //NON HA IL name="xxx" ASSOCIATO E QUINDI POI NON RIESCO A GESTIRE I CAMPI DI VALIDAZIONE
               //DALL'ESTERNO $scopeController.frmName.inputName.$valid , $pristine , $error , etc... COSI INVECE FUNZIONA!
               return `
<div class="umb-property" property="property">
    <div class="control-group umb-control-group" ng-class="{'error': !isValid}">
        <div class="umb-el-wrap">
            <label class="control-label" for="${name}">
                {{label}}
            </label>
            <div class="controls controls-row">
                <input type="${type}" name="${name}" ng-model="model" ng-required="isReq=='true'" class="umb-editor umb-textstring textstring">
                <span ng-if="!isValid" class="help-inline">{{errMessage}}</span>
            </div>
        </div>
    </div>
</div>
`           }
        }
    }
}