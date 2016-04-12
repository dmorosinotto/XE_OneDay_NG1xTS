namespace xeModule.Directives {
    export function xeTextboxDir(): ng.IDirective {
        return {
            restrict: 'E',
            scope: {
                label: '@',
                model: '=',
                isReq: '@'
            },
            template: `
<div class="umb-property" property="property">
    <div class="control-group umb-control-group">
        <div class="umb-el-wrap">
            <label class="control-label">
                {{label}}
            </label>
            <div class="controls controls-row">
                <input name="{{label}}" ng-model="model" ng-required="isReq=='true'" class="umb-editor umb-textstring textstring">
            </div>
        </div>
    </div>
</div>
`
        }
    }
}