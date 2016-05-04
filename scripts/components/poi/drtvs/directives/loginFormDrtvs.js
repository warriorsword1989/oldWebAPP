/**
 * Created by Administrator on 2016/5/4.
 */
myApp.directive('loginForm', function() {
    return {
        restrict: 'EA',
        replace: true,
        templateUrl: '../../scripts/components/poi/drtvs/tpls/loginForm.htm',
        link: function(scope, element, attrs){
            // …Ë÷√≥ı º◊¥Ã¨;
            scope.show_error=false;
            scope.show_type = attrs.showstyle;

            if (scope.show_type == 2) {
                scope.show_error = true;
            } else {
                scope.show_error = false;
            }

            function countPos(){
                var left = (element[0].offsetParent.clientWidth - element[0].clientWidth)/2;
                var top = (element[0].offsetParent.clientHeight - element[0].clientHeight)/2+35;
                element.css('left', left+'px');
                element.css('top', top+'px');
            }
            countPos();
            window.onresize = function(){
                countPos();
            }
        }
    };
});