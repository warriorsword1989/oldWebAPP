
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
    fastmap.dataApi.ajaxConstruct(Application.url+'/fcc/tip/getSnapshot?parameter={"grids":['+meshidArray.toString()+'],"stage":['+stage.toString()+'],"type":'+type+',"projectId":'+Application.projectid+'}',
        function(data){
            func(data)
        }
    )
};
Application.functions.getTipsResult=function(rowkey,func) {
    fastmap.dataApi.ajaxConstruct('http://192.168.4.130/FosEngineWeb3'+'/fcc/tip/getByRowkey?parameter={"rowkey":"'+rowkey+'"}',
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
Application.functions.getRdObjectById=function(id,type,func,detailid) {
    if(!id){
        fastmap.dataApi.ajaxConstruct(Application.url+'/edit/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","detailId":'+detailid+'}',
            function(data) {
                func(data);
            });
    }else{
        fastmap.dataApi.ajaxConstruct(Application.url+'/edit/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","pid":'+id+'}',
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
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/getByPid?parameter={"projectId":'+Application.projectid+',"type":"'+type+'","detailId":'+id+'}',
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
    fastmap.dataApi.ajaxConstruct(Application.url + '/edit/run?parameter=' + param.replace(/\+/g,'%2B'),
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
    fastmap.dataApi.ajaxConstruct(Application.url + '/edit/run?parameter=' + param,
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
    fastmap.dataApi.ajaxConstruct(Application.url+'/metadata/patternImage/search?parameter=' + param,
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
 *  更新高速分歧属性值 
 * @param param
 * @param func
 */
Application.functions.saveBranchInfo=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/run?parameter=' + param,
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
    fastmap.dataApi.ajaxConstruct(Application.url+'/metadata/pinyin/convert?parameter=' + param,
        function (data) {
            func(data)
        });
};

/***
 * 保存node移动
 * @param param
 * @param func
 */
Application.functions.saveNodeMove = function(param, func){
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/run?parameter=' + param,
        function (data) {
            func(data)
        });
}

Application.functions.getByCondition=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/getByCondition?parameter='+param,
        function (data) {
            func(data)
        });
};

//根据输入的道路名模糊查询所有道路民
Application.functions.getNamesbyName = function(param,func){
    fastmap.dataApi.ajaxConstruct(Application.url+'/metadata/rdname/search?parameter=' + param,
        function (data) {
            func(data)
        });
}

//获取检查结果
Application.functions.getCheckDatas = function(param,func){
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/check/get?parameter=' + param,
        function (data) {
            func(data)
        });
}

//获取检查结果总数
Application.functions.getCheckCount = function(param,func){
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/check/count?parameter=' + param,
        function (data) {
            func(data)
        });
}

//获取检查状态
Application.functions.updateCheckType = function(param,func){
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/check/update?parameter=' + param,
        function (data) {
            func(data)
        });
}
/**
 * 获取controller中的scope
 * @param controller
 * @returns {*}
 */
Application.functions.getScope=function(controller) {
        var getController = document.querySelector('[ng-controller='+controller+']');
        var scope = angular.element(getController).scope();
        return scope;
};

/***
 * 获取互联网rtic代码
 */
Application.functions.getIntRticRank=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/applyPid?parameter=' + param,
        function (data) {
            func(data)
        });
};

/***
 * 获取层级
 */
Application.functions.getCondition=function(param,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/edit/getByCondition?parameter=' + param,
        function (data) {
            func(data)
        });
};