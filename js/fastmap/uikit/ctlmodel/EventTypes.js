/**
 * Created by zhongxiaoming on 2016/3/17.
 * Class EventTypes
 */
L.Mixin.EventTypes={
    //为避免冲突，事件类型需要定义为不同值
    GETLINKID:'getLinkId',
    LAYERONADD:'layerOnAdd',
    LAYERONREMOVE:'layerOnRemove',
    LAYERONSWITCH:'layerSwitch',
    LAYERONSHOW:'layerOnShow',
    LAYERONEDIT:'layerOnEdit',
    GETRELATIONID:'getRelationId',

    GETOUTLINKSPID:'getOutLinksPid',
    GETNODEID:'getNodeId',
    GETCROSSNODEID:'getCorssNodeId',
    GETTIPSID:'getTipsId',
    SELECTBYATTRIBUTE:'selectByAttribute',
    FEATURESELECTED:'featureSelected',
    FEATURECLEARED:'featureCleared',

    RESETCOMPLETE:'resetComplete',
    GETBOXDATA:'dataOfBoxEvent',

    DIRECTEVENT:'directEvent',
    TILEDRAWEND:'tileDrawend',

    SNAPED:'snaped',
    STARTSHAPEEDITRESULTFEEDBACK:'startshapeeditresultfeedback',
    ABORTSHAPEEDITRESULTFEEDBACK:'abortshapeeditresultfeedback',
    STOPSHAPEEDITRESULTFEEDBACK:'stoptshapeeditresultfeedback',

    SELECTBYATTRIBUTE:"selectByAttribute",//属性选择事件

    SAVEPROPERTY:'saveproperty',//属性面板保存事件
    DELETEPROPERTY:'deleteproperty',//属性面板删除事件
    CANCELEVENT:'cancelevent',//属性面板撤销事件

    SELECTEDFEATURETYPECHANGE:'selectedfeaturechange',//objectcontroller选择要素类型变化事件
    SELECTEDFEATURECHANGE:'selectedfeaturechange'//objectcontroller选择要素(pid)变化事件

}