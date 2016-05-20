
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
    fastmap.mapApi.ajaxConstruct(Application.url+Application.tipsServer+'/getStats?parameter={'
        + '"grids":['+Application.meshIdArr.toString()+'],"stage":['+stage.toString()+']}',
        function(data){
            func(data)
        }
    )
}
Application.functions.getTipsListItems=function(stage,type,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+Application.tipsServer+'/getSnapshot?parameter={'
        + '"grids":['+Application.meshIdArr.toString()+'],"stage":['+stage.toString()+'],"type":'+type+',"projectId":'+Application.projectid+'}',
        function(data){
            func(data)
        }
    )
};
Application.functions.getTipsResult=function(rowkey,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+Application.tipsServer+'/getByRowkey?parameter={"rowkey":"'+rowkey+'"}',
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
    fastmap.mapApi.ajaxConstruct(Application.url+Application.tipsServer+'/edit?parameter=' + param,
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
        fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","detailId":'+detailid+'}',
            function(data) {
                func(data);
            });
    }else{
        fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","pid":'+id+'}',
            function(data) {
                func(data);
            });
    }

};
/***
 * 属性和几何编辑相关 editGeometryOrProperty
 * @param param
 * @param func
 */
Application.functions.editGeometryOrProperty = function (param, func) {
    fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/run?parameter=' + param.replace(/\+/g,'%2B'),
        function (data) {
            func(data)
        });
};

//获取检查结果
Application.functions.getCheckData = function(param,func){
    fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/check/get?parameter=' + param,
        function (data) {
            func(data)
        });
}

//获取检查结果总数
Application.functions.getCheckCount = function(param,func){
    fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/check/count?parameter=' + param,
        function (data) {
            func(data)
        });
}

//获取检查状态
Application.functions.updateCheckType = function(param,func){
    fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/check/update?parameter=' + param,
        function (data) {
            func(data)
        });
}

/***
 * 获取互联网rtic代码
 */
Application.functions.getIntRticRank=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/applyPid?parameter=' + param,
        function (data) {
            func(data)
        });
};

/***
 * 根据接口getByCondition获取相关数据
 */
Application.functions.getByCondition=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+Application.editServer+'/getByCondition?parameter=' + param,
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
    fastmap.mapApi.ajaxConstruct(Application.url+Application.metaServer+'/patternImage/search?parameter=' + param,
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
    return Application.url+Application.metaServer+'/patternImage/getById?parameter=' + param;
};


/**
 *  高速分歧 名称发音和语音 
 * @param param
 * @param func
 */
Application.functions.getNamePronunciation=function(param,func) {
    fastmap.mapApi.ajaxConstruct(Application.url+Application.metaServer+'/pinyin/convert?parameter=' + param,
        function (data) {
            func(data)
        });
};



//根据输入的道路名模糊查询所有道路民
Application.functions.getNamesbyName = function(param,func){
    fastmap.mapApi.ajaxConstruct(Application.url+Application.metaServer+'/rdname/search?parameter=' + param,
        function (data) {
            func(data)
        });
}
