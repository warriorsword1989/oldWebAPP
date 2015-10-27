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
    fastmap.dataApi.ajaxConstruct('http://192.168.4.130/FosEngineWeb/fcc/tip/getStats?parameter={"grids[":'+meshidArray.toString()+'],"stage":['+stage.toString()+']}',
        function(data){
            console.log(func(data));
        }
    )
}