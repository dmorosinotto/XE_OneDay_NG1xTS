



//FILE ../backoffice/xeModule.js

//inject module into umbraco
angular.module("umbraco")
    .requires.push(
    
    //define module using TS namespace object
    angular.module("xeModule", [])
    .constant("XECUSTOM_BASEAPI", "/umbraco/backoffice/xeCustom/xeCustomApiBackoffice/")
    .constant("XECUSTOM_VIEWDIR", "/App_Plugins/xeCustom/xeModule/components/")
    .controller(xeModule.Controllers)
    .service(xeModule.Services)
    .directive(xeModule.Directives)
    .name //"xeModule"
);
console.log("OK xeModule INJECTED INTO UMBRACO");