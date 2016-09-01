/**
 * Created by linglong;
 * Email: linglong@navinfo.com;
 * Date 2016/8/31;
 * Time 11:36
 */
angular.module('app').controller('photoEngNameCtrl', ['$scope', '$ocLazyLoad', 'NgTableParams', 'ngTableEventsChannel', 'uibButtonConfig', '$sce', 'dsEdit', '$document', 'appPath', '$interval', '$timeout', 'dsMeta','$compile','$attrs',
    function($scope, $ocLazyLoad, NgTableParams, ngTableEventsChannel, uibBtnCfg, $sce, dsEdit, $document, appPath, $interval, $timeout, dsMeta,$compile,$attrs) {
        var _self = $scope;
        $scope.photoEngNmaeTpl = 'photoEngNmaeTpl';

        $scope.view = {};
        $scope.view.cols = [
            //{ field: "selector",headerTemplateURL: "headerCheckboxId",title:'选择', show: true,width:'60px'},
            { field: "classifyRules11", title: "作业类型",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "kind", title: "分类",getValue:getClassifyRules,show: true,width:'150px'},
            { field: "name11Chi", title: "标准中文名称",getValue:get11Names,show: true,width:'150px'},
            { field: "name12Chi", title: "原始英文名称",getValue:get12Names,show: true,width:'150px'},
            { field: "pid", title: "PID",show: false,width:'100px'}
        ];
        /*--------------------------格式化数据部分--------------------------*/
        function get11Names($scope, row){
            return row.name11Chi.name;
        }
        function get12Names($scope, row){
            return row.name12Chi.name;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>';
            }
            return html;
        }
        function getClassifyRules($scope, row){
            var type = row.classifyRules;
            var html = '';
            for(var i = 0 ; i < type.length ; i++){
                html +='<span class="badge">'+type[i]+'</span>';
            }
            return html;
        }
        /*--------------------------格式化数据部分--------------------------*/
        //初始化表格;
        function initRoadNameTable() {
            _self.tableParams = new NgTableParams({
                page: 1,
                count:2
            }, {
                counts: [],
                getData: function($defer, params) {
                    var param = {
                        subtaskId: parseInt(App.Temp.subTaskId),
                        pageNum: params.page(),
                        pageSize: params.count(),
                        sortby: params.orderBy().length == 0 ? "" : params.orderBy().join(""),
                        params:{"name":params.filter().name,"nameGroupid":params.filter().nameGroup,"admin":params.filter().admin,"sql":params.filter().sql}
                    };
                    dsMeta.columnDataList(param).then(function(data) {
                        $scope.loadTableDataMsg = '列表无数据';
                        var temp = new FM.dataApi.ColPoiList(data.data);
                        console.info(temp);
                        $scope.roadNameList = temp.dataList;
                        _self.tableParams.total(data.total);
                        $defer.resolve(temp.dataList);
                    });
                }
            });
            //固定分页位置;
            var timer = setInterval(function(){
                if($(".content .dark > div").get(0)){
                    $('.content').append($(".content .dark > div"));
                    $(".content > div").eq(1).css('padding','0 10px');
                    clearInterval(timer);
                }
            },30)
        };

        /*初始化方法*/
        function initPage(){
            initRoadNameTable();
        }
        initPage();
    }
]);