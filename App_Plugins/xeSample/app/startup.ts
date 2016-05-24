// main entry point 
import {bootstrap} from "ng-metadata/platform";
import {AppModule} from "./app.module";

// INCLUDE CSS IN BUNDLE AND DYNAMICALLY LOAD IT TO HEAD STYLES WHEN RUN THIS
const mycss = require("fs").readFileSync(__dirname + "/./styles.css", "utf-8");
require("insert-css")(mycss);

// inject module into umbraco
angular.module("umbraco")
    .requires.push( AppModule ); // app
console.log("OK AppModule INJECTED INTO UMBRACO");

// that boostrap the app.module
// bootstrap(AppModule);
bootstrap("umbraco", {strictDi: false});
