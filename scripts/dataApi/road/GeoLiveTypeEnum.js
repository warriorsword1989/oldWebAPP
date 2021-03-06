/**
 * Created by wangtun on 2016/4/21.
 * GeoLive模型枚举，统一用枚举来判断类型及服务表名
 */

fastmap.dataApi.GeoLiveModelType = {
    /*
     行政区划点
     */
    ADADMIN: 'ADADMIN',
    /*
     行政区划点名称
     */
    ADADMINNAME: 'ADADMINNAME',
    /*
     行政区划面
     */
    ADFACE: 'ADFACE',
    /*
     行政区划线
     */
    ADLINK: 'ADLINK',
    /*
      分歧
     */
    RDBRANCH: 'RDBRANCH',
    /*
      分歧详细信息
     */
    RDBRANCHDETAIL: 'RDBRANCHDETAIL',
    /*
      分歧名称
     */
    RDBRANCHNAME: 'RDBRANCHNAME',
    /*
      分歧实景图
     */
    RDBRANCHREALIMAGE: 'RDBRANCHREALIMAGE',
    /*
     分歧模式图
     */
    RDBRANCHSCHEMATIC: 'RDBRANCHSCHEMATIC',
    /*
      连续分歧
     */
    RDBRANCHSERIESBRANCH: 'RDBRANCHSERIESBRANCH',
     /*
      实景看板
      */
    RDBRANCHSIGNASREAL: 'RDBRANCHSIGNASREAL',
    /*
      方向看板名称
     */
    RDBRANCHSIGNBOARDNAME: 'RDBRANCHSIGNBOARDNAME',
    /*
     分歧经过
     */
    RDBRANCHVIA: 'RDBRANCHVIA',

    /*
      路口
     */
    RDCROSS: 'RDCROSS',
    /*
      路口内道路
     */
    RDCROSSLINK: 'RDCROSSLINK',
    /*
     路口名称
     */
    RDCROSSNAME: 'RDCROSSNAME',
    /*
      路口内道路端点
     */
    RDCROSSNODE: 'RDCROSSNODE',
    /*
      立交
     */
    RDGSC: 'RDGSC',
    /*
      立交组成道路
     */
    RDGSCLINK: 'RDGSCLINK',
    /*
       车信
     */
    RDLANECONNEXITY: 'RDLANECONNEXITY',
    /*
      车信联通
     */
    RDLANETOPOLOGY: 'RDLANETOPOLOGY',
    /*
      车信经过LINK
     */
    RDLANEVIA: 'RDLANEVIA',
    /*
     道路形态
     */
    RDLINKFORM: 'RDLINKFORM',
    /*
      道路与Rtic关系（互联网客户）
     */
    RDLINKINTRTIC: 'RDLINKINTRTIC',
    /*
      道路名
     */
    RDLINKNAME: 'RDLINKNAME',
    /*
    "道路与RTIC关系"
     */
    RDLINKRTIC: 'RDLINKRTIC',
    /*
     道路人行便道
     */
    RDLINKSIDEWALK: 'RDLINKSIDEWALK',
    /*
     道路限速
     */
    RDLINKSPEEDLIMIT: 'RDLINKSPEEDLIMIT',
    /*
     道路卡车限速
     */
    RDLINKTRUCKLIMIT: 'RDLINKTRUCKLIMIT',
    /*
     道路人行阶梯
     */
    RDLINKWALKSTAIR: 'RDLINKWALKSTAIR',
    /*
     道路与ZONE关系
     */
    RDLINKZONE: 'RDLINKZONE',
    /*
       道路
     */
    RDLINK: 'RDLINK',
    /*
       道路端点
     */
    RDNODE: 'RDNODE',
    /*
      道路端点形态
     */
    RDNODEFORM: 'RDNODEFORM',
    /*

     */
    /*
      交限
     */
    RDRESTRICTION: 'RDRESTRICTION',
    /*
      交限时间段与车辆限制
     */
    RDRESTRICTIONCONDITION: 'RDRESTRICTIONCONDITION',
    /*
      交限详细信息
     */
    RDRESTRICTIONDETAIL: 'RDRESTRICTIONDETAIL',
    /*
      限速
     */
    RDSPEEDLIMIT: 'RDSPEEDLIMIT',
    /*
     铁路
     */
    RWLINK: 'RWLINK',
    /*
     电子眼
     */
    RDELECTRONICEYE: 'RDELECTRONICEYE',
    /*
     电子眼旋转
     */
    ELECTRANSFORMDIRECT: 'ELECTRANSFORMDIRECT',
    /*
     坡度
     */
    RDSLOPE: 'RDSLOPE',
    /*
     限高限重
     */
    RDHGWGLIMIT: 'RDHGWGLIMIT',
    /*
     坡度连续link
     */
    RDSLOPELINKS: 'RDSLOPELINKS',
    /*
     TMC点
     */
    TMCPOINT: 'TMCPOINT',
    /*
     TMC匹配信息
     */
    RDTMCLOCATION: 'RDTMCLOCATION'
};
