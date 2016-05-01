angular.module("umbraco", (angular.version.full > "1.2") ? ["ngRoute"] : [] )
.factory("notificationsService", function(){
  function show(prefix) {
    return function (title,msg) {
        window.alert(prefix + (title||"").toUpperCase() + ": \n" + msg);
    }
  }
  return {
      success: show(""),
      error: show("ERROR - "),
      info: show("INFO - "),
      warning: show("WARN - ")
  }
})
.config(function($routeProvider) {
  $routeProvider
   .when('/ngmeta', {
     template: '<my-app>Loading...</my-app>',
   })
   .when('/edit/:id', {
    templateUrl: '/App_Plugins/xeCustom/backoffice/xeCustomTree/edit.html',
    controller: 'SmartMainCtrl'
  })
  .when('/barcode/:id', {
    templateUrl: '/App_Plugins/xeCustom/backoffice/xeCustomTree/barcode.html',
    controller: 'BarcodeCtrl'
  });
});

