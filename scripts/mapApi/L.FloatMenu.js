/**
 * Created by wangtun on 2016/3/31.
 */
L.Control.FloatMenu = L.Class.extend({
    initialize: function (pid,mouseEvent, options) {
        this.selectObjPid = pid;
        this._mouseEvent = mouseEvent;
        this.items = options.items||[];
        this.visible = false;
        L.Util.setOptions(this, options);
    },

    onAdd: function (map) {
        this._latlng = map.mouseEventToLatLng(this._mouseEvent);

        this._el = L.DomUtil.create('div', 'my-custom-layer leaflet-zoom-hide');


        this.toolBarContainer = L.DomUtil.create('ul', 'floatMenu');
        this._map = map;

        var buttons=[];
        for(var i=0;i<this.items.length;i++){
            buttons.push(this._createButton(this.items[i].text,this.items[i].title,this.items[i].type,this.items[i].class||"",this.toolBarContainer,this.items[i].callback,this));
        }

        this._el.appendChild(this.toolBarContainer);
        map.getPanes().overlayPane.appendChild(this._el);

        // add a viewreset event listener for updating layer's position, do the latter
        map.on('viewreset', this._reset, this);
        //this._reset();

    },

    onRemove: function (map) {
        map.getPanes().overlayPane.removeChild(this._el);
        map.off('viewreset', this._reset, this);
    },

    setVisible:function(flag){
        var buttons=$(".floatMenu>li");
        this.visible=flag;
        var r=100,n= 5;
        if(flag){
            $(".floatMenu").show();
            setTimeout(function(){
                for(var i= 0,len=buttons.length;i<len;i++){
                    $(buttons[i]).css("display","block").css("transform","translate("+(r*Math.cos((45-180/n*i)*(Math.PI/180)))+"px,"+(-r*Math.sin((45-180/n*i)*(Math.PI/180)))+"px").css("transition",'1s')
                }
            },100)

        }
        else{
            for(var i= 0,len=buttons.length;i<len;i++){
                $(buttons[i]).css("transform","translate(0px,0px").css("transition",'1s')
            }

            setTimeout(function(){
                $(".floatMenu").hide();
            },1000)
        }
    },

    _createButton: function (html, title,type, className, container, fn, context) {
        var link = L.DomUtil.create('li', className, container);
        link.innerHTML = html;
        link.type = type;
        link.title = title;

        var stop = L.DomEvent.stopPropagation;
        if(fn){
            L.DomEvent
                .on(link, 'click', L.DomEvent.stopPropagation)
                .on(link, 'mousedown', L.DomEvent.stopPropagation)
                .on(link, 'click', L.DomEvent.preventDefault)
                .on(link, 'click', fn, context)
        }

        return link;
    },

    _reset: function () {
        var pos = this._map.latLngToContainerPoint(this._latlng);
        L.DomUtil.setPosition(this._el, pos);
    }
});