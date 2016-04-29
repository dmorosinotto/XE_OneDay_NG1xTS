namespace xeModule.Directives {
    export function xeTextboxCnt(): ng.IDirective {
        return {
            restrict: 'E',
            scope: {
                name: '@',
                label: '@',
                isValid: '=',
                errMessage: '@'
            },
            transclude: true,
            template: `
<div class="umb-property" property="property">
    <div class="control-group umb-control-group" ng-class="{'error': !isValid}">
        <div class="umb-el-wrap">
            <label class="control-label" for="name">
                {{label}}
            </label>
            <div class="controls controls-row">
                <span class="umb-editor umb-textstring textstring" ng-transclude></span>
                <span ng-if="!isValid" class="help-inline">{{errMessage}}</span>
            </div>
        </div>
    </div>
</div>
`           
        }
    }
}