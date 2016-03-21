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
    SELECTBYATTRIBUTE:"selectByAttribute"
}