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
    fastmap.dataApi.ajaxConstruct(Application.url+'/fcc/tip/getSnapshot?parameter={"rowkey":'+rowkey+'}',
        function(data){
            func(data)
        }
    )
};
Application.functions.getRdLinkById=function(id,type,func) {
    fastmap.dataApi.ajaxConstruct(Application.url+'/pdh/obj/getByPid?parameter={"projectId":1,"type":"'+type+'","pid":'+id+'}',
    function(data) {
        func(data)
    });
};