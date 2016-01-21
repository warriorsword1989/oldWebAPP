/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTipsController
 */


fastmap.uikit.ToolTipsController=(function() {
    var instantiated;
    function init(options) {
        var toolTipsController = L.Class.extend({
            /**
             * 事件管理器
             * @property includes
             */
            includes: L.Mixin.Events,
            options: {},

            /***
             *
             * @param {Object}options
             */
            initialize: function (options) {
                this.options = options || {};
                this._map=null;
                L.setOptions(this, options);
                this.on("toolStateChanged", this.setCurrentTooltip, this);
                this.toolsdiv="";
                this.orginStyle="";
            },
            /***
             * 设置地图对象
             * @param map
             */
            setMap:function(map,divid){
                this._map = map;
                this._divid=divid;
            },
            /***
             *
             * @param type
             */
            setEditEventType:function(type){
                this.eventType = type;
            },
            setChangeInnerHtml:function(innerhtmltext){
                this.innervalue = innerhtmltext;
            },
            setDbClickChangeInnerHtml:function(innerhtmltext){
                this.DbClickInnervalue = innerhtmltext;
            },
            setStyleTooltip:function(style){
                this.tooltipstyle=style;
            },
            onMoveOutTooltip:function(){
                this.toolsdiv.style.display = "none";
            },
            onMoveTooltip:function(event){
                this.toolsdiv.style.display = "block";
                this.toolsdiv.style.marginLeft = event.originalEvent.clientX-10+ 'px';
                this.toolsdiv.style.marginTop = event.originalEvent.clientY -20+ 'px';
                this._map.on('click', this.onClickTooltip,this);
                this._map.on('mouseout', this.onMoveOutTooltip,this);
            },
            onClickTooltip:function(event){
                if(this.eventType=="drawPath"){
                    this.toolsdiv.innerHTML=this.innervalue;
                    this.toolsdiv.style.cssText+=this.tooltipstyle;
                    this._map.on('dblclick', this.onDbClickTooltip,this);
                }else {
                    if(this.innervalue){
                        this.toolsdiv.innerHTML=this.innervalue;
                    }
                    this.toolsdiv.style.cssText+=this.tooltipstyle;
                }
            },
            onRemoveTooltip:function(){
                this.innervalue="";
                this.eventType="";
                this.toolsdiv.innerHTML = "";
                this.toolsdiv.style.display = 'none';
                this._map.off('click', this.onClickTooltip,this);
                this._map.off('mousemove', this.onMoveTooltip,this);
                this._map.off('dblclick', this.onDbClickTooltip,this);
            },
            onDbClickTooltip:function(){
                this.toolsdiv.innerHTML=this.DbClickInnervalue;
                this.toolsdiv.style.cssText+=this.tooltipstyle;
            },
            /***
             * 设置tooltip
             * @param {Object}tooltip
             */
            setCurrentTooltip: function (tooltip) {
                var tools=L.DomUtil.get(this._divid);
                this._map.on('mousemove', this.onMoveTooltip,this);
                tools.style.display = 'block';
                tools.innerHTML=tooltip;
                this.toolsdiv=tools;
                this.orginStyle=tools.style.cssText;
            },
            getCurrentTooltip:function(){
                return this.toolsdiv.innerHTML;
            }

        });
        return new toolTipsController(options);
    }
    return function(options) {
        if (!instantiated) {
            instantiated = init(options);
        }
        return instantiated;
    }
})();


