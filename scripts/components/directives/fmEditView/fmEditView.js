/**
 * Created by wuzhen on 2016/5/4.
 */
//方式一在表单的各个输入域中定义指令
angular.module('fastmap.uikit').directive('fmEditView', function() {
    return {
        restrict: 'A',
        controller:function ($scope, $element){
            $scope.$on("clearAttrStyleDown",function (){
                //var label = angular.element($element).parents('li').find('label:first');
                var label = $($element).parents('li').find('label:first');
                label.removeClass("modifiedInfo");
            });
        },
        link: function ($scope, $element, attrs) {
            //var label = angular.element($element).parents('li').find('label:first');
            var label = $($element).parents('li').find('label:first');
            $element.bind('change',function (){
                label.addClass("modifiedInfo");
            });
            // $scope.$watch('model', function (a,b,c){ //不能使用watch的原因是，当切换POI的时候model就会发生变化，就会增加样式
            //     label.addClass("modifiedInfo");
            // });;
            //label.removeClass("modifiedInfo");
        },

    };
});
angular.module('fastmap.uikit').directive('formDisabled',function() {
    return {
        restrict:'A',
        replace:false,
        link: function ($scope, elem, attrs) {
            if($scope.isSpecialOperation) {
                angular.element(elem).find('input').attr('disabled','disabled').addClass('chosen-disabled');
                angular.element(elem).find('textarea').attr('disabled','disabled').addClass('chosen-disabled');
                angular.element(elem).find('.lv-container').addClass('chosen-disabled');
                angular.element(elem).find('select').attr('disabled','disabled').addClass('chosen-disabled');
                // angular.element(elem).find('.select2-option').addClass('chosen-disabled');
            }
        }
    };
});
/**
 * 用于ng-table表格cell编辑
 */
angular.module('fastmap.uikit').directive('fmBindCompiledHtml',function (){
    return {
        restrict: "A",
        controller: function ($scope, $element, $attrs, $compile){
            $scope.$watch($attrs.fmBindCompiledHtml, function (html){
                var compiledElements = $compile(html)($scope);
                $element.empty();
                $element.append(compiledElements);
            });
        }
    };
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
