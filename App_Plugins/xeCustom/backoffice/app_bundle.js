var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function ngSort() {
            return ngUtils.makeComponent({
                EorA: "A",
                inputs: [],
                outputs: [],
                bindings: ["sort:=ngSort"],
                controller: "ngSortCtrl",
                template: undefined
            });
        }
        Directives.ngSort = ngSort;
        function ngSortby() {
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
        Directives.ngSortby = ngSortby;
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var ngSortCtrl = (function () {
            function ngSortCtrl() {
                this.icon = "icon-";
                this.iconAsc = " icon-chevron-up";
                this.iconDesc = " icon-chevron-down";
                this.cols = [];
            }
            ngSortCtrl.prototype.register = function (sortby) {
                this.cols.push(sortby);
                //setIcon(sortby);
            };
            ngSortCtrl.prototype.sortBy = function (fieldName) {
                var _this = this;
                this.sort = ("-" + this.sort === "-" + fieldName) ? "-" + fieldName : fieldName;
                this.cols.forEach(function (col) { return _this.setIcon(col); });
            };
            ngSortCtrl.prototype.setIcon = function (col) {
                if (col.fieldName === this.sort || "-" + col.fieldName === this.sort) {
                    col.css = (this.sort === col.fieldName ? this.iconAsc : this.iconDesc);
                }
                else {
                    col.css = this.icon;
                }
            };
            return ngSortCtrl;
        }());
        Controllers.ngSortCtrl = ngSortCtrl;
        var ngSortbyCtrl = (function () {
            function ngSortbyCtrl() {
            }
            ngSortbyCtrl.prototype.$onInit = function () {
                this.ngSort.register(this);
            };
            ngSortbyCtrl.prototype.Toggle = function () {
                this.ngSort.sortBy(this.fieldName);
            };
            return ngSortbyCtrl;
        }());
        Controllers.ngSortbyCtrl = ngSortbyCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var ngUtils;
(function (ngUtils) {
    //simulo angular.component per versioni di angular < 1.5 e anche bindToController per versioni < 1.3
    function makeComponent(_a) {
        var EorA = _a.EorA, labels = _a.labels, inputs = _a.inputs, outputs = _a.outputs, bindings = _a.bindings, template = _a.template, controller = _a.controller, controllerAs = _a.controllerAs, require = _a.require, transclude = _a.transclude;
        var ddo = {};
        var ver = angular.version.full;
        //costruisco i bindings in base ai valori passati
        var Bindings = bindings ? bindings.map(function (b) { return new Binding(b); }) : [];
        //riporto nello scope gli inputs con binding '@' (labels)
        if (labels)
            Bindings = Bindings.concat(labels.map(function (l) { return new Binding(l, '@'); }));
        //riporto nello scope gli inputs con binding '<' (one-way databound)
        if (inputs)
            Bindings = Bindings.concat(inputs.map(function (i) { return new Binding(i, '<'); }));
        //riporto nello scope gli output con binding '&' (event bound) 
        if (outputs)
            Bindings = Bindings.concat(outputs.map(function (o) { return new Binding(o, '&'); }));
        //setto restrict=tipo direttiva element o attribute (default 'E')
        ddo.restrict = EorA || 'E';
        //setto isolate scope per la direttiva e setto i bindings
        ddo.scope = {};
        Bindings.forEach(function (b) { return ddo.scope[b.locProp] =
            (ver >= "1.5" ? b.type : b.type.replace('<', '=')) + b.extAttr; });
        //se sono su angular>1.3 abilito bindToController per riportre in-out nel controllerAs
        if (Bindings.length > 0 && ver >= "1.3") {
            ddo.bindToController = true;
        } //altrimento simulo bindToController usando la link function per "syncronizzare" in-out scope<-->ctrl
        //setto il template o il templateUrl controllando se il valore passato e' html o un url
        if (template) {
            if (template.lastIndexOf(".html") > 0 && template.indexOf("<") < 0 && template.indexOf(">") < 0) {
                ddo.templateUrl = template;
            }
            else {
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
            var ctrlAs = (hasAs > 0) ? controller.substring(hasAs + 4) : (controllerAs || "ctrl");
            ddo.controllerAs = ctrlAs;
            ddo.controller = (hasAs > 0) ? controller : controller + " as " + ctrlAs;
            //altrimenti simulo bindToController usando la link function per "syncronizzare" in-out scope<-->ctrl
            ddo.link = function linkToController(scope, el, attr, ctrl) {
                if (!ddo.bindToController) {
                    //ottimizzo faccio un watch di tutti gli inputs (come array) per intercettare tutte le modifiche runtime degl input e aggioranre il controllerAs 
                    var iall = Bindings.filter(function (b) { return b.isInput; }).map(function (i) { return i.locProp; });
                    if (iall)
                        scope.$watch("[" + iall.join(',') + "]", function syncFrom() {
                            iall.forEach(function (i) { return scope[ctrlAs][i] = scope[i]; });
                        }, true);
                    //per tutti gli input '=','<','@' creo un watch per intercettare le modifiche runtime dei valori scope --> ctrl 
                    /*Bindings.filter(b => b.isInput).forEach(i=> {
                       scope.$watch(i.locProp, ()=> { scope[ctrlAs][i.locProp] = scope[i.locProp]; });
                    });*/
                    //per gli output basta semplicemente copiare i puntatori a funzione degli handle di evento da scope --> ctrl
                    Bindings.filter(function (b) { return b.isOutput; }).forEach(function (o) {
                        scope[ctrlAs][o.locProp] = scope[o.locProp];
                    });
                    //sincornizzo input indietro da ctrl --> scope solo per '=' (two-way databound)
                    Bindings.filter(function (b) { return b.isSync; }).forEach(function (b) {
                        scope.$watch(ctrlAs + "." + b.locProp, function () { scope[b.locProp] = scope[ctrlAs][b.locProp]; });
                    });
                }
                //se ho require ignetto il ctrl richiesto nel ctrlAs
                if (require) {
                    var req = (['^', '?'].indexOf(require.charAt(0)) >= 0) ? require.substr(1) : require;
                    scope[ctrlAs][req] = ctrl;
                }
                //life-cycle hooks
                if (typeof scope[ctrlAs].$onInit === "function") {
                    scope[ctrlAs].$onInit({ scope: scope, el: el, attr: attr, ctrl: ctrl });
                }
                if (typeof scope[ctrlAs].$onDestroy === "function") {
                    scope.$on("$destroy", function () { return scope[ctrlAs].$onDestroy(); });
                }
            };
        }
        return ddo; //ritorno il DirectiveDefinitionObject creato per gestire il Component
    }
    ngUtils.makeComponent = makeComponent;
    var Binding = (function () {
        function Binding(binding, deftype) {
            var b = binding.split(':').map(function (s) { return s.replace(' ', ''); });
            if (b.length === 1) {
                if (['=', '@', '&', '<'].indexOf(b[0].charAt(0)) >= 0) {
                    this.type = b[0].charAt(0);
                    this.extAttr = b[0].substring(1);
                }
                else {
                    this.type = deftype;
                    this.extAttr = b[0];
                }
                this.locProp = this.extAttr;
            }
            else {
                this.locProp = b[0];
                if (['=', '@', '&', '<'].indexOf(b[1].charAt(0)) >= 0) {
                    this.type = b[1].charAt(0);
                    this.extAttr = (b[1].substring(1)) || b[0];
                }
                else {
                    this.type = deftype;
                    this.extAttr = b[1];
                }
            }
        }
        Object.defineProperty(Binding.prototype, "isSync", {
            get: function () {
                return this.type === '=';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "isOutput", {
            get: function () {
                return this.type === '&';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Binding.prototype, "isInput", {
            get: function () {
                return ['=', '<', '@'].indexOf(this.type) >= 0;
            },
            enumerable: true,
            configurable: true
        });
        return Binding;
    }());
})(ngUtils || (ngUtils = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeCounter() {
            return ngUtils.makeComponent({
                inputs: ["data", "max", "limit"],
                outputs: [],
                controller: "xeCounterCtrl",
                template: "\n<div class=\"row-fluid\">\n    <div class=\"span3 offset1\"><b>Iscritti: {{ctrl.tot}}</b> <i>/ {{ctrl.max}}</i></div>\n    <div class=\"span3 offset1\"><b>Confermati: {{ctrl.conf}}</b> <i>/ {{ctrl.limit}}</i></div>\n    <div class=\"span3 offset1\"><b>Presenti: {{ctrl.pres}}</b> <i>/ {{ctrl.conf}}</i></div>\n</div>\n" });
        }
        Directives.xeCounter = xeCounter;
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var xeCounterCtrl = (function () {
            function xeCounterCtrl() {
            }
            Object.defineProperty(xeCounterCtrl.prototype, "data", {
                set: function (value) {
                    if (value) {
                        this.tot = value.length;
                        this.conf = value.filter(function (s) { return s.IsConfirmed; }).length;
                        this.pres = value.filter(function (s) { return s.IsPresent; }).length;
                    }
                    else {
                        this.tot = 0;
                        this.conf = 0;
                        this.pres = 0;
                    }
                },
                enumerable: true,
                configurable: true
            });
            return xeCounterCtrl;
        }());
        Controllers.xeCounterCtrl = xeCounterCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeFilter(VIEWDIR) {
            return ngUtils.makeComponent({
                inputs: [],
                outputs: ["onFilter", "onRefresh"],
                controller: "xeFilterCtrl",
                template: VIEWDIR + "xefilter.html"
            });
        }
        Directives.xeFilter = xeFilter;
        xeFilter.$inject = ["XECUSTOM_VIEWDIR"];
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var xeFilterCtrl = (function () {
            function xeFilterCtrl() {
                this._filter = {};
            }
            xeFilterCtrl.prototype.setFilter = function ($event, flt) {
                if ($event && $event.preventDefault)
                    $event.preventDefault();
                switch (Number(flt)) {
                    case -3:
                        this._filter.IsPresent = true;
                        delete this._filter.IsConfirmed;
                        break;
                    case -2:
                        this._filter.IsConfirmed = true;
                        delete this._filter.IsPresent;
                        break;
                    case -1:
                        delete this._filter.IsConfirmed;
                        delete this._filter.IsPresent;
                        break;
                    default:
                        this._filter.$ = flt;
                }
                this.onFilter({ $event: this._filter });
            };
            xeFilterCtrl.prototype.getFilterType = function () {
                if (this._filter.IsPresent) {
                    return 'Solo presenti';
                }
                else if (this._filter.IsConfirmed) {
                    return 'Solo confermati';
                }
                else {
                    return 'Tutti iscritti';
                }
            };
            return xeFilterCtrl;
        }());
        Controllers.xeFilterCtrl = xeFilterCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeList() {
            return ngUtils.makeComponent({
                inputs: ["data", "currFilter"],
                outputs: ["onDelete", "onBarcode", "onEmail", "onCheck"],
                controller: "xeListCtrl",
                template: "\n<table class=\"table\">\n    <thead ng-sort=\"ctrl.order\">\n        <tr>\n            <td ng-sortby=\"Name\">Nome</td>\n            <td ng-sortby=\"Surname\">Cognome</td>\n            <td ng-sortby=\"Email\">Email</td>\n            <td ng-sortby=\"City\">Citt&agrave;</td>\n            <td ng-sortby=\"IsPresent\">Azioni</td>\n        </tr>\n    </thead>\n    <tbody>\n        <tr ng-repeat=\"s in ctrl.data | filter: ctrl.currFilter :strict | orderBy: ctrl.order\" \n            ng-class=\"{error: (!s.IsConfirmed && !s.IsPresent), success: s.IsPresent}\">\n            <td><b>{{s.Name}}</b></td>\n            <td><b>{{s.Surname}}</b></td>\n            <td>{{s.Email}}</td>\n            <td>{{s.City}}</td>\n            <td>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onDelete({$event:s})\"><i class=\"icon-trash\"></i></button>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onBarcode({$event:s})\"><i class=\"icon-barcode\"></i></button>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onEmail({$event:s})\"><i class=\"icon-envelope\"></i></button>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onCheck({$event:s})\"><i ng-class=\"s.IsPresent ? 'icon-ok' : 'icon-remove'\"></i></button>\n            </td>\n        </tr>\n    </tbody>\n</table>\n" });
        }
        Directives.xeList = xeList;
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var xeListCtrl = (function () {
            function xeListCtrl() {
                this.order = "Name";
            }
            return xeListCtrl;
        }());
        Controllers.xeListCtrl = xeListCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeNewSubs(VIEWDIR) {
            return ngUtils.makeComponent({
                inputs: ["eventid"],
                outputs: ["onRegistration"],
                controller: "xeNewSubsCtrl",
                template: VIEWDIR + 'xenewsubs.html'
            });
        }
        Directives.xeNewSubs = xeNewSubs;
        xeNewSubs.$inject = ["XECUSTOM_VIEWDIR"];
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var xeNewSubsCtrl = (function () {
            function xeNewSubsCtrl(api, msg) {
                this.api = api;
                this.msg = msg;
            }
            xeNewSubsCtrl.prototype.toggleInsert = function () {
                //mostra la form di inserimento dati
                this.inInsert = !this.inInsert;
                //initializza il model data con dei valori default (EventId + Privacy=true)
                if (this.inInsert)
                    this.data = {
                        Name: "", Surname: "", Email: "", City: "",
                        EventId: this.eventid,
                        Privacy: true
                    };
            };
            xeNewSubsCtrl.prototype.Cancel = function () {
                //nasconde la form di inserimento dati
                this.inInsert = false;
            };
            xeNewSubsCtrl.prototype.Save = function () {
                var _this = this;
                //chiamata API per salvare i dati sul DB
                this.api.newSubscription(this.data)
                    .then(function (r) { return r.data; }, function (e) {
                    if (e.status == 400) {
                        _this.msg.showError("Formato dati inviati non valido, controllare che l'Email sia valida !", "ERROR 400");
                    }
                    else if (e.status == 409) {
                        _this.msg.showError("Iscrizione non accettata, esiste gia' una registrazione con questa Email !", "ERROR 409");
                    }
                    else {
                        _this.msg.showError("ERROR " + e.status, "Errore nella iscrizione");
                    }
                })
                    .then(function (s) {
                    if (s) {
                        //nasconde la form inserimento ed emette evento onRegistration per notificare padre dell'avvenuta registrazione
                        _this.inInsert = false;
                        _this.onRegistration({ $event: s });
                    }
                });
            };
            xeNewSubsCtrl.$inject = ["XeApiSvc", "MsgboxSvc"];
            return xeNewSubsCtrl;
        }());
        Controllers.xeNewSubsCtrl = xeNewSubsCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeRegistration() {
            return ngUtils.makeComponent({
                inputs: ["eventid"],
                outputs: ["onRegistration"],
                controller: "xeRegistrationCtrl",
                template: '<button class="btn" ng-click="ctrl.modalRegister()">Nuova Registrazione</button>'
            });
        }
        Directives.xeRegistration = xeRegistration;
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var xeRegistrationCtrl = (function () {
            function xeRegistrationCtrl(api, msg, dialog, VIEWDIR) {
                this.api = api;
                this.msg = msg;
                this.dialog = dialog;
                this.VIEWDIR = VIEWDIR;
            }
            xeRegistrationCtrl.prototype.modalRegister = function () {
                var _this = this;
                this.dialog.open({
                    iframe: false,
                    template: this.VIEWDIR + "xeregistration.html",
                    dialogData: {
                        EventId: this.eventid,
                        Privacy: true
                    },
                    callback: function (r) {
                        if (r) {
                            _this.api.newSubscription(r)
                                .then(function (r) { return r.data; }, function (e) {
                                if (e.status == 400) {
                                    _this.msg.showError("Formato dati inviati non valido, controllare che l'Email sia valida !", "ERROR 400");
                                }
                                else if (e.status == 409) {
                                    _this.msg.showError("Iscrizione non accettata, esiste gia' una registrazione con questa Email !", "ERROR 409");
                                }
                                else {
                                    _this.msg.showError("ERROR " + e.status, "Errore nella iscrizione");
                                }
                            })
                                .then(function (s) {
                                if (s)
                                    _this.onRegistration({ $event: s });
                            });
                        }
                    }
                });
            };
            xeRegistrationCtrl.$inject = ["XeApiSvc", "MsgboxSvc", "dialogService", "XECUSTOM_VIEWDIR"];
            return xeRegistrationCtrl;
        }());
        Controllers.xeRegistrationCtrl = xeRegistrationCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeSmartMain(VIEWDIR) {
            return ngUtils.makeComponent({
                inputs: ["routeParamId"],
                outputs: [],
                controller: "xeSmartMainCtrl",
                template: VIEWDIR + "xesmartmain.html"
            });
        }
        Directives.xeSmartMain = xeSmartMain;
        xeSmartMain.$inject = ["XECUSTOM_VIEWDIR"];
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var xeSmartMainCtrl = (function () {
            function xeSmartMainCtrl(api, msg) {
                this.api = api;
                this.msg = msg;
            }
            Object.defineProperty(xeSmartMainCtrl.prototype, "routeParamId", {
                set: function (value) {
                    if (value) {
                        this.currEvent = new xeModule.Models.EventStore(this.api, this.msg, value);
                        this.currEvent.loadData();
                    }
                },
                enumerable: true,
                configurable: true
            });
            ;
            xeSmartMainCtrl.$inject = ["XeApiSvc", "MsgboxSvc"];
            return xeSmartMainCtrl;
        }());
        Controllers.xeSmartMainCtrl = xeSmartMainCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Directives;
    (function (Directives) {
        function xeTextboxDir() {
            return {
                restrict: 'E',
                scope: {
                    label: '@',
                    model: '=',
                    isReq: '@',
                    isValid: '=',
                    errMessage: '@'
                },
                template: function (tElement, tAttrs) {
                    var name = tAttrs.name || tAttrs.label;
                    var type = tAttrs.type || "text";
                    //STO TORNANDO UNA FUNZIONE CHE RITORNA DINAMICAMENTE L'HTML CON IL name="xxx" DELL'INPUT ATTUALIZZATO!
                    //PERCHE' HO IL PROBLEMA CHE <input name="{{label}}" NON VIENE VALUTATA IN MODO CORRETTO
                    //O MEGLIO FORSE VIENE INTERPOLATA TROPPO TARDI E QUESTO CAUSA IL PROBLEMA CHE NG-MODEL 
                    //NON HA IL name="xxx" ASSOCIATO E QUINDI POI NON RIESCO A GESTIRE I CAMPI DI VALIDAZIONE
                    //DALL'ESTERNO $scopeController.frmName.inputName.$valid , $pristine , $error , etc... COSI INVECE FUNZIONA!
                    return "\n<div class=\"umb-property\" property=\"property\">\n    <div class=\"control-group umb-control-group\" ng-class=\"{'error': !isValid}\">\n        <div class=\"umb-el-wrap\">\n            <label class=\"control-label\" for=\"" + name + "\">\n                {{label}}\n            </label>\n            <div class=\"controls controls-row\">\n                <input type=\"" + type + "\" name=\"" + name + "\" ng-model=\"model\" ng-required=\"isReq=='true'\" class=\"umb-editor umb-textstring textstring\">\n                <span ng-if=\"!isValid\" class=\"help-inline\">{{errMessage}}</span>\n            </div>\n        </div>\n    </div>\n</div>\n";
                }
            };
        }
        Directives.xeTextboxDir = xeTextboxDir;
    })(Directives = xeModule.Directives || (xeModule.Directives = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var BarcodeCtrl = (function () {
            function BarcodeCtrl(api, currTreeNode, $routeParams) {
                var _this = this;
                this.api = api;
                //var e = currTreeNode.dialogOptions.currentNode.id.split("|"); //inject into $scope by umbraco when opening command actions palette
                var id = (currTreeNode.dialogOptions && currTreeNode.dialogOptions.currentNode && currTreeNode.dialogOptions.currentNode.id) || $routeParams["id"];
                var e = id.split("|");
                this.currEvent = {
                    eventId: +e[0] || 0,
                    title: e[1] || "",
                    maxSubscriptions: +e[2] || 0,
                    subscriptionLimit: +e[3] || 0
                };
                //call service to get all subscriptions
                api.getEventSubscriptions(this.currEvent.eventId).then(function (data) { _this.subscriptions = data; });
            }
            BarcodeCtrl.prototype.barcode = function (id) {
                var code39 = String(id);
                while (code39.length < 6) {
                    code39 = "0" + code39;
                }
                return code39;
            };
            BarcodeCtrl.prototype.print = function () {
                document.body.classList.add("PrintNO");
                window.print();
                document.body.classList.remove("PrintNO");
            };
            BarcodeCtrl.$inject = ["XeApiSvc", "$scope", "$routeParams"];
            return BarcodeCtrl;
        }());
        Controllers.BarcodeCtrl = BarcodeCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Controllers;
    (function (Controllers) {
        var SmartMainCtrl = (function () {
            function SmartMainCtrl($routeParams, $scope) {
                this.routeParamId = $scope.routeParamId = $routeParams["id"];
            }
            SmartMainCtrl.$inject = ["$routeParams", "$scope"];
            return SmartMainCtrl;
        }());
        Controllers.SmartMainCtrl = SmartMainCtrl;
    })(Controllers = xeModule.Controllers || (xeModule.Controllers = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Models;
    (function (Models) {
        var EventStore = (function () {
            function EventStore(api, msg, routeParamId) {
                this.api = api;
                this.msg = msg;
                var e = routeParamId.split("|");
                this.eventId = Number(e[0]) || 0,
                    this.title = e[1] || "",
                    this.maxSubscriptions = Number(e[2]) || 10;
                this.subscriptionLimit = Number(e[3]) || this.maxSubscriptions;
                this.subscriptions = [];
            }
            EventStore.prototype.loadData = function () {
                var _this = this;
                this.api.getEventSubscriptions(this.eventId)
                    .then(function (data) { return _this.subscriptions = data; });
            };
            EventStore.prototype.delete = function (s) {
                var _this = this;
                if (window.confirm("Sei sicuro di voler eliminare l'iscrizione?")) {
                    this.api.delSubscription(s.Id)
                        .then(function (r) {
                        _this.msg.showResult("L'iscrizione di " + s.Name + " " + s.Surname + " e' stata eliminata!", "Cancellazione riuscita", r);
                        var idx = _this.subscriptions.indexOf(s);
                        _this.subscriptions.splice(idx, 1);
                    });
                }
            };
            EventStore.prototype.toggle = function (s) {
                var _this = this;
                this.api.togglePresent(s)
                    .then(function (r) {
                    var idx = _this.subscriptions.indexOf(s);
                    _this.subscriptions.splice(idx, 1, r);
                });
            };
            EventStore.prototype.barcode = function (s) {
                var _this = this;
                this.api.sendBarcodeEmail(s.Id)
                    .then(function (r) { return _this.msg.showResult("Barcode inviato via email a " + s.Email + "!", "Email biglietto", r); });
            };
            EventStore.prototype.email = function (s) {
                var _this = this;
                this.api.sendConfirmationEmail(s.Id)
                    .then(function (r) { return _this.msg.showResult("Inviata a " + s.Name + " " + s.Surname + "!", "Email conferma", r); });
            };
            return EventStore;
        }());
        Models.EventStore = EventStore;
    })(Models = xeModule.Models || (xeModule.Models = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Services;
    (function (Services) {
        var MsgboxSvc = (function () {
            function MsgboxSvc(notif) {
                this.notif = notif;
            }
            MsgboxSvc.prototype.showAlert = function (msg, title) {
                if (title === void 0) { title = "OK"; }
                if (typeof msg === "string") {
                    this.show(msg, title, "success");
                }
                else {
                    this.show(JSON.stringify(msg), title, "success");
                }
            };
            MsgboxSvc.prototype.showResult = function (msg, title, success) {
                if (success === void 0) { success = true; }
                if (typeof msg === "string") {
                    this.show(msg, title || (success ? "Ritornato" : "Attenzione"), success ? "info" : "warning");
                }
                else {
                    this.show(JSON.stringify(msg), title || (success ? "Ritornato" : "Attenzione"), success ? "info" : "warning");
                }
            };
            MsgboxSvc.prototype.showError = function (msg, title) {
                if (title === void 0) { title = "ERR"; }
                if (typeof msg === "string") {
                    this.show(msg, title, "error");
                }
                else {
                    this.show(JSON.stringify(msg), title, "error");
                }
            };
            MsgboxSvc.prototype.show = function (msg, title, method) {
                this.notif[method](title, msg);
            };
            MsgboxSvc.$inject = ["notificationsService"];
            return MsgboxSvc;
        }());
        Services.MsgboxSvc = MsgboxSvc;
    })(Services = xeModule.Services || (xeModule.Services = {}));
})(xeModule || (xeModule = {}));
var xeModule;
(function (xeModule) {
    var Services;
    (function (Services) {
        var XeApiSvc = (function () {
            function XeApiSvc(http, BASEAPI, msg) {
                this.http = http;
                this.BASEAPI = BASEAPI;
                this.msg = msg;
            }
            XeApiSvc.prototype.getEventSubscriptions = function (eventId) {
                var _this = this;
                return this.http.get(this.BASEAPI + "GetEventSubscriptions/" + eventId)
                    .then(function (r) { return r.data; }, function (e) { return _this.logErrorAPI(e); });
            };
            XeApiSvc.prototype.newSubscription = function (data) {
                return this.http.post(this.BASEAPI + "NewSubscription", data);
            };
            XeApiSvc.prototype.delSubscription = function (subscriptionId) {
                var _this = this;
                return this.http.delete(this.BASEAPI + "DelSubscription/" + subscriptionId)
                    .then(function (r) { return (r.status == 200); }, function (e) { _this.logErrorAPI(e); return false; });
            };
            XeApiSvc.prototype.togglePresent = function (s) {
                var _this = this;
                s.IsPresent = !s.IsPresent;
                return this.http.put(this.BASEAPI + "TogglePresent/" + s.Id, s)
                    .then(function (r) { return r.data; }, function (e) { return _this.logErrorAPI(e); });
            };
            XeApiSvc.prototype.sendConfirmationEmail = function (subscriptionId) {
                var _this = this;
                return this.http.post(this.BASEAPI + "SendConfirmationEmail/" + subscriptionId, {})
                    .then(function (r) { return (r.status == 200); }, function (e) { _this.logErrorAPI(e); return false; });
            };
            XeApiSvc.prototype.sendBarcodeEmail = function (subscriptionId) {
                var _this = this;
                return this.http.post(this.BASEAPI + "SendBarcodeEmail/" + subscriptionId, {})
                    .then(function (r) { return (r.status == 200); }, function (e) { _this.logErrorAPI(e); return false; });
            };
            XeApiSvc.prototype.logErrorAPI = function (e) {
                this.msg.showError("ERROR " + (e.status || ''), "Calling " + e.config.method + " " + e.config.url);
            };
            XeApiSvc.$inject = ["$http", "XECUSTOM_BASEAPI", "MsgboxSvc"];
            return XeApiSvc;
        }());
        Services.XeApiSvc = XeApiSvc;
    })(Services = xeModule.Services || (xeModule.Services = {}));
})(xeModule || (xeModule = {}));
//# sourceMappingURL=app_bundle.js.map