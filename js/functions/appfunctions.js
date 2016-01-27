/**
 * Created by zhongxiaoming on 2015/10/26.
 * Class appfunctions
 */

Application.functions = Application.functions ||{};
/***
 *
 * @param meshidArray图幅号
 * @param stage 1：待作业；3：已作业
 * @param func
 */
Application.functions.getTipsStatics = function(meshidArray, stage,func){
    fastmap.dataApi.ajaxConstruct(Application.url+'/fcc/tip/getStats?parameter={"grids":['+meshidArray.toString()+'],"stage":['+stage.toString()+']}',
        function(data){
            func(data)
        }
    )
}
Application.functions.getTipsListItems=function(meshidArray,stage,type,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/fcc/tip/getSnapshot?parameter={"grids":['+meshidArray.toString()+'],"stage":['+stage.toString()+'],"type":'+type+'}',
        function(data){
            func(data)
        }
    )
};
Application.functions.getTipsResult=function(rowkey,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/fcc/tip/getByRowkey?parameter={"rowkey":"'+rowkey+'"}',
        function(data){
            func(data.data)
        }
    )
};
/**
 * 根据道路id获得道路的详细属性
 * @param id
 * @param type
 * @param func
 */
Application.functions.getRdObjectById=function(id,type,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/pdh/obj/getByPid?parameter={"projectId":11,"type":"'+type+'","pid":'+id+'}',
    function(data) {
        func(data)
    });
};
/**
 * 根据detailId获得详细属性
 * @param id
 * @param type
 * @param func
 */
Application.functions.getRdObjectByDetailId=function(id,type,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/pdh/obj/getByPid?parameter={"projectId":11,"type":"'+type+'","detailId":'+id+'}',
        function(data) {
            func(data)
        });
};
/***
 * 编辑相关
 * @param param
 * @param func
 */
Application.functions.saveLinkGeometry = function (param, func) {
    param = escape(param).replace(/\+/g, '%2B').replace(/\"/g,'%22').replace(/\'/g, '%27').replace(/\//g,'%2F');
    fastmap.dataApi.ajaxConstruct(Application.url + '/pdh/obj/edit?parameter=' + param,
        function (data) {
            func(data)
        });
};
/**
 * 保存属性编辑结果
 * @param param
 * @param func
 */
Application.functions.saveProperty=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url + '/pdh/obj/edit?parameter=' + param,
        function (data) {
            func(data)
        });
};
/**
 *  保存datatips数据
 * @param param
 * @param func
 */
Application.functions.changeDataTipsState=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/fcc/tip/edit?parameter=' + param,
        function (data) {
            func(data)
        });
};
/**
 *  获取箭头图图片组
 * @param param
 * @param func
 */
Application.functions.getArrowImgGroup=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/meta/patternImage/search?parameter=' + param,
        function (data) {
            func(data)
        });
};

/**
 *  获取箭头图图片 
 * @param param
 * @param func
 */
Application.functions.getArrowImg=function(param) {
    return Application.url+'/meta/patternImage/getById?parameter=' + param;
};

/**
 *  更新高速分歧属性值 
 * @param param
 * @param func
 */
Application.functions.saveBranchInfo=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/pdh/obj/edit?parameter=' + param,
        function (data) {
            func(data)
        });
};
/**
 *  高速分歧 名称发音和语音 
 * @param param
 * @param func
 */
Application.functions.getNamePronunciation=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/meta/pinyin/convert?parameter=' + param,
        function (data) {
            func(data)
        });
};

Application.functions.getByCondition=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/pdh/obj/getByCondition?parameter='+param,
        function (data) {
            func(data)
        });
};
