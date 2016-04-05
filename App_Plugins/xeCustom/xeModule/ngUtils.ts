namespace ngUtils {
    export interface IComponent {
        EorA?: 'E' | 'A';
        inputs: string[];
        outputs: string[];
        template: string;
        controller?: string;
    }

    
    export function makeComponent({EorA, inputs, outputs, template, controller}: IComponent): ng.IDirective {
        var ddo: ng.IDirective = {};
        //setto restrict=tipo direttiva element o attribute (default 'E')
        ddo.restrict = EorA || 'E';
        //setto isolate scope per la direttiva
        ddo.scope = {};
        //riporto nello scope gli inputs con binding '=' (2ways databound)
        if (inputs) inputs.forEach(i => ddo.scope[i] = '=');
        //riporto nello scope gli output con binding '&' (event bound) 
        if (outputs) outputs.forEach(o => ddo.scope[o] = '&');
        //setto il template o il templateUrl controllando se il valore passato e' html o un url
        if (template.lastIndexOf(".html")>0 && template.indexOf("<")<0 && template.indexOf(">")<0 ) {
            ddo.templateUrl = template;
        } else {
            ddo.template = template;
        }
        if (controller) {
            //setto il controller as per gestire al direttiva, se non specificato il default AS è ctrl
            ddo.controller = (controller.indexOf(" as ") > 0) ? controller : controller + " as ctrl";
            if (inputs || outputs) {
                if (angular.version.full >= "1.3") { //se sono su angular>1.3 abilito bindToController per riportre in-out nel controllerAs
                    ddo.bindToController = true;
                } else { //altrimento simulo bindToController usando la link function per "syncronizzare" in-out scope<-->ctrl
                    ddo.link = function linkToController(scope, el, attr, ctrl) {
                        //faccio un watch di tutti gli inputs (come array) per intercettare tutte le modifiche runtime degl input e aggioranre il controllerAs 
                        if (inputs) scope.$watch("[" + inputs.join(',') + "]",
                            function syncFrom() { //sincornizzo input da scope --> ctrl per tutti '=' e '@'
                                inputs.forEach(i => ctrl[i] = scope[i]);
                            }, true);
                        /* per ora faccio input oneway databound "<" come in ng1.5 e in NG2, in verita' dovrei deccomentare e ...
                        if (inputs) {
                            inputs.forEach(i => { //sincornizzo input indietro da ctrl --> scope solo per '='
                                scope.$watch("ctrl." + i, () => { scope[i] = ctrl[i]; }) 
                            });
                        } */
                        //per gli output basta semplicemente copiare i puntatori a funzione degli handle di evento da scope --> ctrl
                        if (outputs) outputs.forEach(o => ctrl[o] = scope[o]);
                    }
                }
            }
        }
        return ddo; //ritorno il DirectiveDefinitionObject creato per gestire il Component
    }
}


namespace umbraco.services { //TRICK per sistemare .d.ts umbraco in cui mancava dialogData
    export interface IDialogRenderingOptions {
        dialogData: any
    }
}