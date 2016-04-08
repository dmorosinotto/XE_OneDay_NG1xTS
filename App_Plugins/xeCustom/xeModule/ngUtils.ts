namespace ngUtils {
    export interface IBaseComponent {
        //questi valori devno essere specificati per definire un component/directive
        inputs: string[];       //only propname (binding '<')
        outputs: string[];      //only propname (binding '&')
        template: string;       //template or templateUrl to.html
        controller: string;     //name of class directiveCtrl
    }
    
    export interface IComponent extends IBaseComponent  {
        //volendo si possono usare degli ovverride per caso particolari di component/directive
        EorA?: 'E' | 'A';       //default E
        labels?: string[];      //only propname (binding '@')
        bindings?: string[];    //full syntax:  locProp:=&@<extAttr , oppure locProp: =&@< 
        controllerAs?: string;  //default $ctrl
        require?: string;       //default null
        transclude?: boolean;   //default false
    }


    //simulo angular.component per versioni di angular < 1.5 e anche bindToController per versioni < 1.3
    export function makeComponent({EorA, labels, inputs, outputs, bindings, template, controller, controllerAs, require, transclude}: IComponent): ng.IDirective {
        var ddo: ng.IDirective = {};
        var ver = angular.version.full;
        //costruisco i bindings in base ai valori passati
        var Bindings: Binding[] = bindings ? bindings.map(b => new Binding(b)) : [];
        //riporto nello scope gli inputs con binding '@' (labels)
        if (labels) Bindings = Bindings.concat(labels.map(l => new Binding(l, '@')));
        //riporto nello scope gli inputs con binding '<' (one-way databound)
        if (inputs) Bindings = Bindings.concat(inputs.map(i => new Binding(i, '<')));
        //riporto nello scope gli output con binding '&' (event bound) 
        if (outputs) Bindings = Bindings.concat(outputs.map(o => new Binding(o,'&')));
        
        //setto restrict=tipo direttiva element o attribute (default 'E')
        ddo.restrict = EorA || 'E';
        //setto isolate scope per la direttiva e setto i bindings
        ddo.scope = {};
        Bindings.forEach(b => ddo.scope[b.locProp] = //su versioni <1.5 faccio fallback binding '=' al posto di '<'
            (ver>="1.5" ? b.type : b.type.replace('<','=')) + b.extAttr);
        //se sono su angular>1.3 abilito bindToController per riportre in-out nel controllerAs
        if (Bindings.length>0 && ver >= "1.3") { 
            ddo.bindToController = true;
        } //altrimento simulo bindToController usando la link function per "syncronizzare" in-out scope<-->ctrl
        //setto il template o il templateUrl controllando se il valore passato e' html o un url
        if (template) {
            if (template.lastIndexOf(".html")>0 && template.indexOf("<")<0 && template.indexOf(">")<0 ) {
                ddo.templateUrl = template;
            } else {
                ddo.template = template;
            }
        }
        //setto il require se specificato --> nella link mi passa il ctrl = controller della direttiva richiesta
        if (require) {
            ddo.require = require || "";
        }
        //setto il transclude se specificato --> nel template posso usare <ng-transclude>
        if (transclude) {
            ddo.transclude = !!transclude;
        }
        if (controller) {
            //setto il controller as per gestire al direttiva, se non specificato il default AS è $ctrl
            var hasAs = controller.indexOf(" as ");
            var ctrlAs = (hasAs > 0) ? controller.substring(hasAs+4) : (controllerAs || "ctrl");
            ddo.controllerAs = ctrlAs;
            ddo.controller = (hasAs > 0) ? controller : controller + " as " + ctrlAs;
            //altrimenti simulo bindToController usando la link function per "syncronizzare" in-out scope<-->ctrl
            ddo.link = function linkToController(scope, el, attr, ctrl) {
                if (!ddo.bindToController) {
                    //ottimizzo faccio un watch di tutti gli inputs (come array) per intercettare tutte le modifiche runtime degl input e aggioranre il controllerAs 
                    var iall = Bindings.filter(b => b.isInput).map(i => i.locProp);
                    if (iall) scope.$watch("["+ iall.join(',') +"]",
                        function syncFrom() { //sincornizzo input da scope --> ctrl per tutti '=' e '@'
                            iall.forEach(i => scope[ctrlAs][i] = scope[i]);
                        }, 
                    true);
                    //per tutti gli input '=','<','@' creo un watch per intercettare le modifiche runtime dei valori scope --> ctrl 
                    /*Bindings.filter(b => b.isInput).forEach(i=> {
                       scope.$watch(i.locProp, ()=> { scope[ctrlAs][i.locProp] = scope[i.locProp]; }); 
                    });*/
                    //per gli output basta semplicemente copiare i puntatori a funzione degli handle di evento da scope --> ctrl
                    Bindings.filter(b => b.isOutput).forEach(o => {
                        scope[ctrlAs][o.locProp] = scope[o.locProp];
                    })
                    //sincornizzo input indietro da ctrl --> scope solo per '=' (two-way databound)
                    Bindings.filter(b => b.isSync).forEach(b => {
                        scope.$watch(ctrlAs + "." + b.locProp, () => { scope[b.locProp] = scope[ctrlAs][b.locProp]; }) 
                    })
                } 
                //se ho require ignetto il ctrl richiesto nel ctrlAs
                if (require) {
                    var req = (['^','?'].indexOf(require.charAt(0)) >= 0) ? require.substr(1) : require; 
                    scope[ctrlAs][req] = ctrl;   
                }
                //life-cycle hooks
                if (typeof scope[ctrlAs].$onInit === "function") {
                    scope[ctrlAs].$onInit({scope, el, attr, ctrl});
                }
                if (typeof scope[ctrlAs].$onDestroy === "function") {
                    scope.$on("$destroy", () => scope[ctrlAs].$onDestroy());
                }
            }
        }
        return ddo; //ritorno il DirectiveDefinitionObject creato per gestire il Component
    }
    
    class Binding { //classe helper per gestire i vari tipi di binding
        public type: string; //'=' | '@' | '&' | '<';
        public extAttr: string;
        public locProp: string;
        constructor(binding: string, deftype?: '=' | '@' | '&' | '<') {
            var b = binding.split(':').map(s => s.replace(' ',''));
            if (b.length===1) { //gestion caso semplice "?xxx" ext=loc=xxx
                if (['=','@','&','<'].indexOf(b[0].charAt(0)) >= 0) {
                    this.type = b[0].charAt(0);
                    this.extAttr = b[0].substring(1);
                } else {
                    this.type = deftype;
                    this.extAttr = b[0];
                }
                this.locProp = this.extAttr;
            } else { //gestione del caso complesso "loc:?ext" e anche "loc:?" --> ext=loc
                this.locProp = b[0];
                if (['=','@','&','<'].indexOf(b[1].charAt(0)) >= 0) {
                    this.type = b[1].charAt(0);
                    this.extAttr = (b[1].substring(1)) || b[0];
                } else {
                    this.type = deftype;
                    this.extAttr = b[1];
                }
            }
        }
        get isSync():boolean {
            return this.type === '=';
        }
        get isOutput():boolean {
            return this.type === '&'
        }
        get isInput():boolean {
            return ['=','<','@'].indexOf(this.type) >= 0;
        }
    }
}


namespace umbraco.services { //TRICK per sistemare .d.ts umbraco in cui mancava dialogData
    export interface IDialogRenderingOptions {
        dialogData: any
    }
}