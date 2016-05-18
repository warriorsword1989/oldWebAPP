/* 
 * modified by liuyang
 * 
 */
(function() {

L.Control.Checkbox = L.Control.extend({
	includes: L.Mixin.Events,

	options: {
		container: '',					//container id to insert Search Control
		minLength: 1,					//minimal text length for autocomplete
		initial: true,					//search elements only by initial text
		autoType: true,					//complete input with first suggested result and select this filled-in text.
		autoResize: true,				//autoresize on input change
		collapsed: true,				//collapse search control at startup
		autoCollapse: false,			//collapse search control after submit(on button or on tips if enabled tipAutoSubmit)
		autoCollapseTime: 1200,			//delay for autoclosing alert and collapse after blur
		text: '引导坐标随拖动变化',   //placeholder value
		hideMarkerOnCollapse: false,    //remove circle and marker on search control collapsed
		position: 'topleft',
		data:null
	},
	initialize: function(options) {
		L.Util.setOptions(this, options || {});
		this._inputMinSize = this.options.text ? this.options.text.length : 10;
		this._autoTypeTmp = this.options.autoType;	//useful for disable autoType temporarily in delete/backspace keydown
		this._curReq = null;
	},

	onAdd: function (map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-check');
		this._content = this._createInput(this.options.text, 'check-input');
		this._input = this._content.input;
		this._span = this._content.span;
		this._button = this._createButton(this.options.text, 'check-button');

		if(this.options.collapsed===false)
			this.expand(this.options.collapsed);
		 map.on({
		     'resize': this._handleAutoresize
		 	}, this);
		return this._container;
	},
	addTo: function (map) {

		if(this.options.container) {
			this._container = this.onAdd(map);
			this._wrapper = L.DomUtil.get(this.options.container);
			this._wrapper.style.position = 'relative';
			this._wrapper.appendChild(this._container);
		}
		else
			L.Control.prototype.addTo.call(this, map);

		return this;
	},

	expand: function(toggle) {//展开
		toggle = typeof toggle === 'boolean' ? toggle : true;
		this._input.style.display = 'block';
		this._span.style.display = 'block';
		L.DomUtil.addClass(this._container, 'check-rad');
		// if ( toggle !== false ) {
		// 	this._input.focus();
		// 	this._map.on('dragstart click', this.collapse, this);
		// }
		this.fire('check_expanded');
		return this;	
	},

	collapse: function() {//折叠
		this._input.blur();
		if(this.options.collapsed)
		{
			this._input.style.display = 'none';
			this._span.style.display = 'none';
			L.DomUtil.removeClass(this._container, 'check-rad');
			// if (this.options.hideMarkerOnCollapse) {
			// 	this._markerLoc.hide();
			// }
			// this._map.off('dragstart click', this.collapse, this);
		}
		this.fire('check_collapsed');
		return this;
	},

	_createInput: function (text, className) {
		var content = {
			span:null,
			input:null
		};
		var span = L.DomUtil.create('span', className, this._container);
		var input = L.DomUtil.create('input', className, this._container);
		input.type = 'checkbox';
		input.size = this._inputMinSize;
		input.value = '';
		input.style.display = 'none';
		input.id = "autoDrag";

		span.innerHTML =text;
		span.style.display = 'none';
		span.id = "searchType";

		L.DomEvent
			// .disableClickPropagation(input)
			.on(input, 'click', this._changeAutoDraw, this);

		content.span = span;
		content.input = input;

		return content;
	},

	_createButton: function (title, className) {
		var button = L.DomUtil.create('a', className, this._container);
		button.href = '#';
		button.title = title;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', this._handleSubmit, this);
		return button;
	},

	_handleAutoresize: function() {	//autoresize this._input
	    //TODO refact _handleAutoresize now is not accurate
	    if (this._input.style.maxWidth != this._map._container.offsetWidth) //If maxWidth isn't the same as when first set, reset to current Map width
	        this._input.style.maxWidth = L.DomUtil.getStyle(this._map._container, 'width');

		if(this.options.autoResize && (this._container.offsetWidth + 45 < this._map._container.offsetWidth))
			this._input.size = this._input.value.length<this._inputMinSize ? this._inputMinSize : this._input.value.length;
	},

	_handleSubmit: function() {	//button and tooltip click and enter submit
		if(this._input.style.display == 'none')	//on first click show _input only
			this.expand();
		else
		{
			this.collapse();
		}
	},
	_changeAutoDraw:function () {
		var val = this._input.checked;
		this.changeAutoDraw(val);
	},
	changeAutoDraw:function (type,val,data) {

	}
});


L.Map.addInitHook(function () {
    if (this.options.searchControl) {
        this.searchControl = L.control.search(this.options.searchControl);
        this.addControl(this.searchControl);
    }
});

L.control.checkbox = function (options) {
    return new L.Control.Checkbox(options);
};

}).call(this);

