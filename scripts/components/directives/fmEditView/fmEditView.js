/**
 * Created by wuzhen on 2016/5/4.
 */
//方式一在表单的各个输入域中定义指令
angular.module('fastmap.uikit').directive('fmEditView', function() {
    return {
        restrict: 'A',
        controller: function($scope, $element) {
            $scope.$on("clearAttrStyleDown", function() {
                //var label = angular.element($element).parents('li').find('label:first');
                var label = $($element).parents('li').find('label:first');
                label.removeClass("modifiedInfo");
            });
        },
        link: function($scope, $element, attrs) {
            //var label = angular.element($element).parents('li').find('label:first');
            var label = $($element).parents('li').find('label:first');
            $element.bind('change', function() {
                label.addClass("modifiedInfo");
            });
            // $scope.$watch('model', function (a,b,c){ //不能使用watch的原因是，当切换POI的时候model就会发生变化，就会增加样式
            //     label.addClass("modifiedInfo");
            // });;
            //label.removeClass("modifiedInfo");
        },
    };
});
angular.module('fastmap.uikit').directive('formDisabled', function() {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, elem, attrs) {
            $scope.$watch('isSpecialOperation', function(newVal, oldVal) {
                if (newVal) {
                    elem.find('input').attr('disabled', 'disabled').addClass('chosen-disabled');
                    elem.find('textarea').attr('disabled', 'disabled').addClass('chosen-disabled');
                    elem.find('.lv-radio').attr('disabled', 'disabled').addClass('chosen-disabled');
                    elem.find('select').attr('disabled', 'disabled').addClass('chosen-disabled');
                    elem.find('.select2-option').addClass('chosen-disabled');
                } else {
                    elem.find('input').attr('disabled', null).removeClass('chosen-disabled');
                    elem.find('textarea').attr('disabled', null).removeClass('chosen-disabled');
                    elem.find('.lv-radio').attr('disabled', null).removeClass('chosen-disabled');
                    elem.find('select').attr('disabled', null).removeClass('chosen-disabled');
                    elem.find('.select2-option').removeClass('chosen-disabled');
                }
            });
        }
    }
});
/**
 * 用于ng-table表格cell编辑
 */
angular.module('fastmap.uikit').directive('fmBindCompiledHtml', function() {
    return {
        restrict: "A",
        controller: function($scope, $element, $attrs, $compile) {
            $scope.$watch($attrs.fmBindCompiledHtml, function(html) {
                var compiledElements = $compile(html)($scope);
                $element.empty();
                $element.append(compiledElements);
            }, true);
        }
    }
});
/**
 * 限制输入字符
 */
angular.module('fastmap.uikit').directive('fmInputControl', function() {
    return {
        restrict: "A",
        replace: false,
        scope: {
            objectmodel: '='
        },
        link: function(scope, elem, attrs) {
            var re = new RegExp('^[0-9]*$');
            elem.bind('change', function() {
                if (!re.test(scope.objectmodel)) {
                    scope.objectmodel = 0;
                    scope.$apply();
                }
            });
        }
    }
});
/**
 * 图片缩放
 */
angular.module('fastmap.uikit').directive('imgShow', function() {
    return {
        restrict: "A",
        replace: false,
        link: function (scope, element, attr) {
            wheelzoom(element);
        }
    }
});
/**
 * 图片404时加默认图片
 */
angular.module('fastmap.uikit').directive('image404', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            var notFoundCount = 0;
            if (!attributes.src) {
                changeSCR();
            }
            element.on('error', changeSCR);

            function changeSCR() {
                var newIamgeUrl = attributes.image404;
                if (notFoundCount >= 3 || !newIamgeUrl) {
                    newIamgeUrl = getDefaultImagePlaceholder();
                }
                element.attr('src', newIamgeUrl);
                notFoundCount++;
            }

            function getDefaultImagePlaceholder() {
                var width = angular.element(element[0]).attr('max-width') || element[0].offsetWidth || 120;
                var height = angular.element(element[0]).attr('max-height') || element[0].offsetHeight || 120;
                var bgcolor = attributes.fbBgcolor ? attributes.fbBgcolor.replace('#', '') : "";
                var color = attributes.fbColor ? attributes.fbColor.replace('#', '') : "";
                var text = attributes.fbText || "";
                var result = '';
                var protocol = window.location.href.split('://').shift();
                if (!protocol) protocol = 'http';
                result = protocol + '://dummyimage.com/' + width + 'x' + height;
                if (bgcolor && color) {
                    result += '/' + bgcolor + '/' + color;
                }
                if (text) {
                    result += '&text=' + text;
                }
                return result;
            }
        }
    }
});
/**
 *
 */
angular.module('fastmap.uikit').directive('fmAutoFocus', function($timeout) {
    return {
        restrict: 'A',
        replace: false,
        link: function($scope, element, attrs) {},
        controller: function($scope, $element, $timeout) {
            $scope.selectFirstNum = function() {
                $timeout(function() {
                    //$($element).find("input[name=fmFocus]").focus();
                    angular.element($element).find('input[name=fmFocus]:eq(0)').focus();
                }, 200);
            };
        }
    }
});
//方式二在form中增加指令
//angular.module('fastmap.uikit', []).directive('myForm',function (){
//     return {
//         restrict: 'EA',
//         scope: {
//             model: '=ngModel'
//         },
//         controller:function ($scope, $element){
//             console.info("++++++++");
//             // var eventCtrl = fastmap.uikit.EventController();
//             // eventCtrl.on("tttt",function (){
//             //     console.info("=========on=====");
//             //     var label = angular.element($element).parents('li').find('label');
//             //     label.removeClass("modifiedInfo");
//             // });
//             $scope.$on("clearAttrStyleDown",function (){
//                 console.info("=========on=====");
//                 var label = angular.element($element).find('label');
//                 label.removeClass("modifiedInfo");
//             });
//         },
//         link: function ($scope, element, attrs) {
//             console.info("----------",$scope.model);
//             var input = angular.element(element).find('input[type=radio]');
//             input.each(function (i){
//                 var label = angular.element(this).parents('li').find('label:first');
//                 angular.element(this).on('click',function (){
//                     angular.element(label).addClass("modifiedInfo");
//                 });
//             });
//             var textarea = angular.element(element).find('textarea');
//             textarea.each(function (i){
//                 var label = angular.element(this).parents('li').find('label:first');
//                 angular.element(this).on('change',function (){
//                     angular.element(label).addClass("modifiedInfo");
//                 });
//             });
//             var select = angular.element(element).find('select');
//             select.each(function (i){
//                 var label = angular.element(this).parents('li').find('label:first');
//                 angular.element(this).on('change',function (){
//                     angular.element(label).addClass("modifiedInfo");
//                 });
//             });
//             //label.removeClass("modifiedInfo");
//         },
//
//     };
// });