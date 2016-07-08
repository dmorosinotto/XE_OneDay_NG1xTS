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
   .when('/comp/:id', {
     template: '<md-read-params data="$resolve.data" async="$resolve.async"></md-read-params>',
     resolve: {
       data: function(){return "ciao"},
       async: asyncData
     }
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

function asyncData($http, $routeParams, $route){
  console.warn(new Date().getMilliseconds(), "In resolve $routeParams=", $routeParams)
  console.info(new Date().getMilliseconds(), "BUT YOU CAN USE:", $route.current.params);
  var id = $route.current.params.id;
  
  return $http.get("/Events/" + id).then(
    function (r){ console.log(new Date().getMilliseconds(), "GET asyncDATA"); return r.data},
    function (e){ alert("ERRORE id:"+ id +" non trovato!") }
  );
}
asyncData.$inject = ["$http","$routeParams","$route"]