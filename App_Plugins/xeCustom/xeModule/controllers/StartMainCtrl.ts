namespace xeModule.Controllers {
    export class SmartMainCtrl {
        static $inject = ["$routeParams","$scope"];
        constructor($routeParams: ng.route.IRouteParamsService, $scope: any) {
            this.routeParamId = $scope.routeParamId = $routeParams["id"];
        }
        public routeParamId: string;
    }
}