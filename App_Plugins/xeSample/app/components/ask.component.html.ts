export default `
<b>TRICK HTML Q:</b> {{$ctrl.question}} ? <input ng-model="$ctrl.response">
<button ng-click="$ctrl.answer()">Answer</button>
`;
