var ngUtils;
(function (ngUtils) {
    function makeComponent(_a) {
        var EorA = _a.EorA, inputs = _a.inputs, outputs = _a.outputs, template = _a.template, controller = _a.controller;
        var ddo = {};
        //setto restrict=tipo direttiva element o attribute (default 'E')
        ddo.restrict = EorA || 'E';
        //setto isolate scope per la direttiva
        ddo.scope = {};
        //riporto nello scope gli inputs con binding '=' (2ways databound)
        if (inputs)
            inputs.forEach(function (i) { return ddo.scope[i] = '='; });
        //riporto nello scope gli output con binding '&' (event bound) 
        if (outputs)
            outputs.forEach(function (o) { return ddo.scope[o] = '&'; });
        //setto il template o il templateUrl controllando se il valore passato e' html o un url
        if (template.lastIndexOf(".html") > 0 && template.indexOf("<") < 0 && template.indexOf(">") < 0) {
            ddo.templateUrl = template;
        }
        else {
            ddo.template = template;
        }
        if (controller) {
            //setto il controller as per gestire al direttiva, se non specificato il default AS è ctrl
            ddo.controller = (controller.indexOf(" as ") > 0) ? controller : controller + " as ctrl";
            if (inputs || outputs) {
                if (angular.version.full >= "1.3") {
                    ddo.bindToController = true;
                }
                else {
                    ddo.link = function linkToController(scope, el, attr, ctrl) {
                        //faccio un watch di tutti gli inputs (come array) per intercettare tutte le modifiche runtime degl input e aggioranre il controllerAs 
                        if (inputs)
                            scope.$watch("[" + inputs.join(',') + "]", function syncFrom() {
                                inputs.forEach(function (i) { return ctrl[i] = scope[i]; });
                            }, true);
                        /* per ora faccio input oneway databound "<" come in ng1.5 e in NG2, in verita' dovrei deccomentare e ...
                        if (inputs) {
                            inputs.forEach(i => { //sincornizzo input indietro da ctrl --> scope solo per '='
                                scope.$watch("ctrl." + i, () => { scope[i] = ctrl[i]; })
                            });
                        } */
                        //per gli output basta semplicemente copiare i puntatori a funzione degli handle di evento da scope --> ctrl
                        if (outputs)
                            outputs.forEach(function (o) { return ctrl[o] = scope[o]; });
                    };
                }
            }
        }
        return ddo; //ritorno il DirectiveDefinitionObject creato per gestire il Component
    }
    ngUtils.makeComponent = makeComponent;
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
                template: "\n<table class=\"table\">\n    <thead>\n        <tr>\n            <td>Nome</td>\n            <td>Cognome</td>\n            <td>Email</td>\n            <td>Citt&agrave;</td>\n            <td>Azioni</td>\n        </tr>\n    </thead>\n    <tbody>\n        <tr ng-repeat=\"s in ctrl.data | filter: ctrl.currFilter :strict | orderBy: 'Name'\" \n            ng-class=\"{error: (!s.IsConfirmed && !s.IsPresent), success: s.IsPresent}\">\n            <td><b>{{s.Name}}</b></td>\n            <td><b>{{s.Surname}}</b></td>\n            <td>{{s.Email}}</td>\n            <td>{{s.City}}</td>\n            <td>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onDelete({$event:s})\"><i class=\"icon-trash\"></i></button>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onBarcode({$event:s})\"><i class=\"icon-barcode\"></i></button>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onEmail({$event:s})\"><i class=\"icon-message\"></i></button>\n                <button class=\"btn btn-small\" ng-click=\"ctrl.onCheck({$event:s})\"><i ng-class=\"s.IsPresent ? 'icon-checkbox' : 'icon-checkbox-empty'\"></i></button>\n            </td>\n        </tr>\n    </tbody>\n</table>\n" });
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
                    isReq: '@'
                },
                template: "\n<div class=\"umb-property\" property=\"property\">\n    <div class=\"control-group umb-control-group\">\n        <div class=\"umb-el-wrap\">\n            <label class=\"control-label\">\n                {{label}}\n            </label>\n            <div class=\"controls controls-row\">\n                <input ng-model=\"model\" ng-required=\"isReq=='true'\" class=\"umb-editor umb-textstring textstring\">\n            </div>\n        </div>\n    </div>\n</div>\n"
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
            function BarcodeCtrl(routeParams, api) {
                var _this = this;
                this.api = api;
                var e = routeParams["id"] || 1121; //$scope.dialogOptions.currentNode.id.split("|");
                this.currEvent = {
                    eventId: +e[0] || 0,
                    title: e[1] || "",
                    maxSubscriptions: +e[2] || 0,
                    subscriptionLimit: +e[3] || 0
                };
                //call service to get all subscriptions
                api.getEventSubscriptions(this.currEvent.eventId).then(function (data) { return _this.subscriptions = data; });
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
            BarcodeCtrl.$inject = ["$routeParams", "XeApiSvc"];
            return BarcodeCtrl;
        }());
        Controllers.BarcodeCtrl = BarcodeCtrl;
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
                this.api.togglePresent(s.Id)
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
            XeApiSvc.prototype.togglePresent = function (subscriptionId) {
                var _this = this;
                return this.http.put(this.BASEAPI + "TogglePresent/" + subscriptionId, {})
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