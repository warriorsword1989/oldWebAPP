/**
 * Created by zhongxiaoming on 2016/3/17.
 * Class EventTypes
 */
L.Mixin.EventTypes = {
    //为避免冲突，事件类型需要定义为不同值
    LAYERONADD: 'layerOnAdd',
    LAYERONREMOVE: 'layerOnRemove',
    LAYERONSWITCH: 'layerSwitch',
    LAYERONSHOW: 'layerOnShow',
    LAYERONEDIT: 'layerOnEdit',
    GETLINKID: 'getLinkId',
    GETRELATIONID: 'getRelationId',
    GETOUTLINKSPID: 'getOutLinksPid',
    GETNODEID: 'getNodeId',
    GETCROSSNODEID: 'getCorssNodeId',
    GETADADMINNODEID: 'getAdAdminNodeId',
    GETTIPSID: 'getTipsId',
    GETPOIID: 'getPoiId',
    GETFACEID: 'getFaceId',
    FEATURESELECTED: 'featureSelected',
    FEATURECLEARED: 'featureCleared',
    RESETCOMPLETE: 'resetComplete',
    GETBOXDATA: 'dataOfBoxEvent',
    DIRECTEVENT: 'directEvent',
    TILEDRAWEND: 'tileDrawend',
    SNAPED: 'snaped',
    STARTSHAPEEDITRESULTFEEDBACK: 'startshapeeditresultfeedback',
    ABORTSHAPEEDITRESULTFEEDBACK: 'abortshapeeditresultfeedback',
    STOPSHAPEEDITRESULTFEEDBACK: 'stoptshapeeditresultfeedback',
    SELECTBYATTRIBUTE: "selectByAttribute", //属性选择事件
    SAVEPROPERTY: 'saveproperty', //属性面板保存事件
    DELETEPROPERTY: 'deleteproperty', //属性面板删除事件
    CANCELEVENT: 'cancelevent', //属性面板撤销事件
    SELECTEDFEATURETYPECHANGE: 'selectedfeaturetypechange', //objectcontroller选择要素类型变化事件
    SELECTEDFEATURECHANGE: 'selectedfeaturechange', //objectcontroller选择要素(pid)变化事件
    CHEKCRESULT: 'checkresult', //检查刷新事件
    CAPTURED: 'captured',
    CHANGELINKNAME: "changeLinkName", //link编辑名称组是
    CHANGEPOILIST: "changePoiList", //更换poiList列表
    GETRECTDATA:"getRectData",
    GETFEATURE:"getFeature",
    SELECTEDVEHICLECHANGE:"selectedVehicleChage", //更改车辆类型时触发,
    CHANGESCENE:"changeScene", //更改场景
    GETEDITDATA:"getEditData", //立交自相交
    SHOWRAWPOI:"showRawPoi" //poi15米移位
}