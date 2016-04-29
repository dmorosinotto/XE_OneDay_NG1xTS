namespace xeModule.Directives {
    export function xeValidator(): ng.IDirective {
        return {
            restrict: 'A',
            scope: {
                xeValidator: '&'
            },
            require: 'ngModel',
            link: function(scope, element, attrs, ngModel: ng.INgModelController) {
                const hasValidators = !!ngModel.$validators;
                //console.info("XE-VALIDATORS",hasValidators);
                if (hasValidators) {
                    ngModel.$validators["xee"] = (modelValue: any, viewValue: any) => {
                        let val = viewValue || modelValue;
                        return scope.xeValidator({val});   
                    };
                } else {
                    //for older angular use $parsers to validate
                    ngModel.$parsers.push( val => {
                        //console.log("PARSE",val);
                        let ok = scope.xeValidator({val}); 
                        ngModel.$setValidity("xe", ok);
                        return ok ? val : undefined;
                    } );
                }
                //ngModel.$formatters.push( val => {console.log("FORMAT",val); return val;  } ); 
            }
        }
    }
}