/**
 * Created by zhongxiaoming on 2015/9/9.
 * Class ToolTipsController
 */
fastmap.uikit.ToolTipsController = (function() {
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
            initialize: function(options) {
                this.options = options || {};
                L.setOptions(this, options);
                this.on("toolStateChanged", this.setCurrentTooltip, this);
            },
            /***
             * 设置地图对象
             * @param map
             */
            setMap: function(map, divId) {
                this._map = map;
                this.originStyle = {
                    position: 'fixed',
                    display: 'none',
                    padding: '0px 3px',
                    border: 'none',
                    borderRadius: '2px',
                    backgroundColor: 'rgba(0,0,0,0.75)',
                    color: 'rgba(255,255,255,0.85)',
                    'max-width': '300px',
                    height: 'auto'
                };
                this.tooltipDiv = L.DomUtil.get(divId);
                L.extend(this.tooltipDiv.style, this.originStyle);
                this._enabled = false;
                this.eventType = null;
            },
            enable: function() {
                if (!this._enabled) {
                    this._map.on('mousemove', this.onMoveTooltip, this);
                    this._map.on('mouseout', this.onMoveOutTooltip, this);
                    this._enabled = true;
                }
            },
            disable: function() {
                if (this._enabled) {
                    this.eventType = null;
                    this.innervalue = null;
                    this.DbClickInnervalue = null;
                    this.externalStyle = null;
                    this.tooltipDiv.innerHTML = "";
                    L.extend(this.tooltipDiv.style, this.originStyle);
                    this._map.off('click', this.onClickTooltip, this);
                    this._map.off('dblclick', this.onDbClickTooltip, this);
                    this._map.off('mousemove', this.onMoveTooltip, this);
                    this._map.off('mouseout', this.onMoveOutTooltip, this);
                    this._enabled = false;
                }
            },
            /***
             *
             * @param type
             */
            setEditEventType: function(type) {
                this.eventType = type;
            },
            setChangeInnerHtml: function(innerhtmltext) {
                this.innervalue = innerhtmltext;
                this._map.off('click', this.onClickTooltip, this);
                this._map.on('click', this.onClickTooltip, this);
            },
            setDbClickChangeInnerHtml: function(innerhtmltext) {
                this.DbClickInnervalue = innerhtmltext;
                this._map.off('dblclick', this.onDbClickTooltip, this);
                this._map.on('dblclick', this.onDbClickTooltip, this);
            },
            setStyleTooltip: function(style) {
                this.externalStyle = style;
            },
            onMoveOutTooltip: function() {
                this.tooltipDiv.style.display = "none";
            },
            onMoveTooltip: function(event) {
                this.tooltipDiv.style.display = "inline-block";
                this.tooltipDiv.style.left = event.originalEvent.clientX + 20 + 'px';
                this.tooltipDiv.style.top = event.originalEvent.clientY + 20 + 'px';
            },
            onClickTooltip: function(event) {
                if (this.externalStyle) {
                    this.tooltipDiv.style.cssText += this.externalStyle;
                }
                if (this.innervalue) {
                    this.tooltipDiv.innerHTML = this.innervalue;
                }
            },
            onRemoveTooltip: function() {
                this.disable();
            },
            onDbClickTooltip: function() {
                if (this.externalStyle) {
                    this.tooltipDiv.style.cssText += this.externalStyle;
                }
                if (this.DbClickInnervalue) {
                    this.tooltipDiv.innerHTML = this.DbClickInnervalue;
                }
            },
            /***
             * 设置tooltip
             * @param {Object}tooltip
             */
            setCurrentTooltip: function(tooltip, type) {
                L.extend(this.tooltipDiv.style, this.originStyle); // 赋默认样式
                var bgColor;
                if (type) {
                    switch (type) {
                        case 'info': // 信息
                            bgColor = '#31b0d5';
                            break;
                        case 'warn': // 警告
                            bgColor = '#f0ad4e';
                            break;
                        case 'error': // 错误
                            bgColor = '#c9302c';
                            break;
                        case 'succ': // 成功
                            bgColor = '#449d44';
                            break;
                    }
                }
                if (bgColor) {
                    this.tooltipDiv.style.backgroundColor = bgColor;
                }
                this.tooltipDiv.innerHTML = tooltip;
                this.enable();
            },
            setCurrentTooltipText: function(tooltiptext) {
                this.tooltipDiv.innerHTML = tooltiptext;
            },
            getCurrentTooltip: function() {
                return this.tooltipDiv.innerHTML;
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