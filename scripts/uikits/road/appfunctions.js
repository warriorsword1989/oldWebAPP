
/**
 * Created by zhongxiaoming on 2015/10/26.
 * Class appfunctions
 */

Application.functions = Application.functions ||{};
/***
 * 根据getStats接口获取相关数据
 * @param stage 1：待作业；3：已作业
 * @param func
 */
Application.functions.getTipsStatics = function(stage,func){
    fastmap.mapApi.ajaxConstruct(Application.url+'/fcc/tip/getStats?parameter={'
        + '"grids":['+Application.meshIdArr.toString()+'],"stage":['+stage.toString()+']}',
        function(data){
            func(data)
        }
    )
}
Application.functions.getTipsListItems=function(stage,type,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/fcc/tip/getSnapshot?parameter={'
        + '"grids":['+Application.meshIdArr.toString()+'],"stage":['+stage.toString()+'],"type":'+type+',"projectId":'+Application.projectid+'}',
        function(data){
            func(data)
        }
    )
};
Application.functions.getTipsResult=function(rowkey,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/fcc/tip/getByRowkey?parameter={"rowkey":"'+rowkey+'"}',
        function(data){
            func(data.data)
        }
    )
};
/**
 *  保存datatips数据
 * @param param
 * @param func
 */
Application.functions.changeDataTipsState=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/fcc/tip/edit?parameter=' + param,
        function (data) {
            func(data)
        });
};
/**
 * 根据道路id获得道路的详细属性
 * @param id
 * @param type
 * @param func
 */
Application.functions.getRdObjectById=function(id,type,func,detailid) {
    if(!id){
        fastmap.mapApi.ajaxConstruct(Application.url+'/edit/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","detailId":'+detailid+'}',
            function(data) {
                func(data);
            });
    }else{
        fastmap.mapApi.ajaxConstruct(Application.url+'/edit/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","pid":'+id+'}',
            function(data) {
                func(data);
            });
    }

};
/**
 * 根据detailId获得详细属性
 * @param id
 * @param type
 * @param func
 */
Application.functions.getRdObjectByDetailId=function(id,type,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/edit/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","detailId":'+id+'}',
        function(data) {
            func(data)
        });
};
/***
 * 属性和几何编辑相关 editGeometryOrProperty
 * @param param
 * @param func
 */
Application.functions.editGeometryOrProperty = function (param, func) {
    fastmap.mapApi.ajaxConstruct(Application.url + '/edit/run?parameter=' + param.replace(/\+/g,'%2B'),
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
    fastmap.mapApi.ajaxConstruct(Application.url+'/metadata/patternImage/search?parameter=' + param,
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
    return Application.url+'/metadata/patternImage/getById?parameter=' + param;
};


/**
 *  高速分歧 名称发音和语音 
 * @param param
 * @param func
 */
Application.functions.getNamePronunciation=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/metadata/pinyin/convert?parameter=' + param,
        function (data) {
            func(data)
        });
};



//根据输入的道路名模糊查询所有道路民
Application.functions.getNamesbyName = function(param,func){
    fastmap.mapApi.ajaxConstruct(Application.url+'/metadata/rdname/search?parameter=' + param,
        function (data) {
            func(data)
        });
}
/**
 * 根据接口check获取相关的数据
 * @param type
 * @param param
 * @param func
 */
Application.functions.getDataByCheck = function(type,param,func){
    fastmap.mapApi.ajaxConstruct(Application.url+'/edit/check/'+type+'?parameter=' + param,
        function (data) {
            func(data)
        });
}


/***
 * 获取互联网rtic代码
 */
Application.functions.getIntRticRank=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/edit/applyPid?parameter=' + param,
        function (data) {
            func(data)
        });
};

/***
 * 根据接口getByCondition获取相关数据
 */
Application.functions.getByCondition=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+'/edit/getByCondition?parameter=' + param,
        function (data) {
            func(data)
        });
};
