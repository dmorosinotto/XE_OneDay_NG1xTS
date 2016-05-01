var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
System.register("app/services/question.service", ["ng-metadata/core"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var core_1;
    var QuestionSvc;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            QuestionSvc = (function () {
                function QuestionSvc(// inject dependency into constructor
                    // for basic factories (like angular 1.x) you must explict @Inject with string token
                    log, $q) {
                    this.log = log;
                    this.$q = $q;
                    this._q = "What is your name";
                }
                QuestionSvc.prototype.getQuestions = function () {
                    this.log.info("getQuestions:", this._q);
                    return this.$q.when(this._q);
                };
                QuestionSvc = __decorate([
                    core_1.Injectable(),
                    // inject dependency into constructor
                    __param(0, core_1.Inject("$log")),
                    __param(1, core_1.Inject("$q")), 
                    __metadata('design:paramtypes', [Object, Function])
                ], QuestionSvc);
                return QuestionSvc;
            }());
            exports_1("QuestionSvc", QuestionSvc);
        }
    }
});
System.register("app/app.path", [], function(exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var VIEWDIR;
    return {
        setters:[],
        execute: function() {
            exports_2("VIEWDIR", VIEWDIR = "/App_Plugins/xeSample/backoffice/dist/");
        }
    }
});
System.register("app/components/my-app.component", ["ng-metadata/core", "app/services/question.service", "app/app.path"], function(exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    var core_2, question_service_1, app_path_1;
    var AppCmp;
    return {
        setters:[
            function (core_2_1) {
                core_2 = core_2_1;
            },
            function (question_service_1_1) {
                question_service_1 = question_service_1_1;
            },
            function (app_path_1_1) {
                app_path_1 = app_path_1_1;
            }],
        execute: function() {
            // import html = require("./my-app.html"); // require external HTML relative path is based on 'app' source folder
            // IGNORE ERROR TS2307: Cannot find module './my-app.html' UNTIL ISSUE #6615 IS CLOSED(https://github.com/Microsoft/TypeScript/issues/6615)
            // OR USE IMPORT WITH FULLPATH TO LOAD THE TEMPLATE HERE
            // import * as html from "app/components/my-app.html";
            // AND HACK A CORRESPONDING DECLARE MODULE IN typings-manual-fix.d.ts
            // declare module "app/components/my-app.html" {
            //      const template: string;
            //      export default template;
            // }
            AppCmp = (function () {
                function AppCmp(// inject dependency into constructor
                    // for basic factories (like angular 1.x) you must explict @Inject with string token
                    win, 
                    // for services defined as TS class decorated with @Injectable you can leverage TS reflect-metadata by Type without explicit @Inject
                    qs) {
                    var _this = this;
                    this.win = win;
                    this.title = "ngMetadata";
                    qs.getQuestions().then(function (q) { return _this.question = q; });
                }
                // method exposed to template via $ctrl (controllerAs default alias)
                AppCmp.prototype.show = function (response) {
                    this.win.alert("Thanks for your response:\n" + response + "!");
                };
                AppCmp = __decorate([
                    core_2.Component({
                        selector: "my-app",
                        templateUrl: app_path_1.VIEWDIR + "./my-app.html",
                    }),
                    // inject dependency into constructor
                    __param(0, core_2.Inject("$window")), 
                    __metadata('design:paramtypes', [Object, question_service_1.QuestionSvc])
                ], AppCmp);
                return AppCmp;
            }());
            exports_3("AppCmp", AppCmp);
        }
    }
});
System.register("app/components/ask.component", ["ng-metadata/core"], function(exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var core_3;
    var AskCmp;
    return {
        setters:[
            function (core_3_1) {
                core_3 = core_3_1;
            }],
        execute: function() {
            AskCmp = (function () {
                function AskCmp() {
                }
                AskCmp.prototype.ngOnInit = function () {
                    console.info("Initialize ASK dumb component");
                    console.assert(!!this.question, "question not setted!");
                    console.assert(!!this.onResponse, "onResponse handle not setted!");
                };
                AskCmp.prototype.answer = function () {
                    if (this.response && this.response.trim() !== "") {
                        this.onResponse({ $event: this.response });
                    }
                };
                __decorate([
                    core_3.Input("@"), 
                    __metadata('design:type', String)
                ], AskCmp.prototype, "question", void 0);
                __decorate([
                    // specify input with '@' binding (interpolate)
                    core_3.Output(), 
                    __metadata('design:type', Function)
                ], AskCmp.prototype, "onResponse", void 0);
                AskCmp = __decorate([
                    core_3.Component({
                        selector: "ask",
                        template: "<b>Q:</b> {{$ctrl.question}} ? <input ng-model=\"$ctrl.response\">\n               <button ng-click=\"$ctrl.answer()\">Answer</button>"
                    }), 
                    __metadata('design:paramtypes', [])
                ], AskCmp);
                return AskCmp;
            }());
            exports_4("AskCmp", AskCmp);
        }
    }
});
System.register("app/app.module", ["ng-metadata/core", "app/components/my-app.component", "app/components/ask.component", "app/services/question.service"], function(exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    var core_4, my_app_component_1, ask_component_1, question_service_2;
    var AppModule;
    return {
        setters:[
            function (core_4_1) {
                core_4 = core_4_1;
            },
            function (my_app_component_1_1) {
                my_app_component_1 = my_app_component_1_1;
            },
            function (ask_component_1_1) {
                ask_component_1 = ask_component_1_1;
            },
            function (question_service_2_1) {
                question_service_2 = question_service_2_1;
            }],
        execute: function() {
            // return/export the module so you can later bootsrap it in the startup using ngMetadata
            // define  'app'   module and register all  components  and  services  defined in other files imported above...
            exports_5("AppModule", AppModule = (_a = (_b = (_c = angular.module("app", [])).directive.apply(_c, core_4.provide(my_app_component_1.AppCmp))).directive.apply(_b, core_4.provide(ask_component_1.AskCmp))).service.apply(_a, core_4.provide(question_service_2.QuestionSvc))
                .name);
        }
    }
    var _a, _b, _c;
});
System.register("app/startup", ["ng-metadata/platform", "app/app.module", "/App_Plugins/xeSample/backoffice/dist/styles.css!"], function(exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var platform_1, app_module_1;
    return {
        setters:[
            function (platform_1_1) {
                platform_1 = platform_1_1;
            },
            function (app_module_1_1) {
                app_module_1 = app_module_1_1;
            },
            function (_1) {}],
        execute: function() {
            // ALTERNATIVE: import css = require("./styles.css"); // require external CSS relative path is based on 'app' source folder
            // inject module into umbraco
            angular.module("umbraco")
                .requires.push(app_module_1.AppModule); // app
            console.log("OK AppModule INJECTED INTO UMBRACO");
            // that boostrap the app.module
            // bootstrap(AppModule);
            platform_1.bootstrap("umbraco", { strictDi: false });
        }
    }
    var _a, _b, _c;
});
//# sourceMappingURL=app-bundle.js.map