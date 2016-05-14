/* 
 * modified by liuyang
 * 
 */
(function() {

L.Control.Search = L.Control.extend({
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
		textPlaceholder: '周边POI',   //placeholder value
		hideMarkerOnCollapse: false,    //remove circle and marker on search control collapsed
		position: 'topleft',
		data:null
	},
	initialize: function(options) {
		L.Util.setOptions(this, options || {});
		this._inputMinSize = this.options.textPlaceholder ? this.options.textPlaceholder.length : 10;
		this._autoTypeTmp = this.options.autoType;	//useful for disable autoType temporarily in delete/backspace keydown
		this._curReq = null;
	},

	onAdd: function (map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-search');
		this._content = this._createInput(this.options.textPlaceholder, 'search-input');
		this._select = this._content.select;
		this._input = this._content.input;
		this._button = this._createButton(this.options.textPlaceholder, 'search-button');

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
		this._select.style.display = 'block';
		L.DomUtil.addClass(this._container, 'search-exp');
		// if ( toggle !== false ) {
		// 	this._input.focus();
		// 	this._map.on('dragstart click', this.collapse, this);
		// }
		this.fire('search_expanded');
		return this;	
	},

	collapse: function() {//折叠
		this._input.blur();
		if(this.options.collapsed)
		{
			this._input.style.display = 'none';
			this._select.style.display = 'none';
			L.DomUtil.removeClass(this._container, 'search-exp');
			// if (this.options.hideMarkerOnCollapse) {
			// 	this._markerLoc.hide();
			// }
			// this._map.off('dragstart click', this.collapse, this);
		}
		this.fire('search_collapsed');
		return this;
	},
	
	collapseDelayed: function() {	//collapse after delay, used on_input blur
		if (!this.options.autoCollapse) return this;
		var that = this;
		clearTimeout(this.timerCollapse);
		this.timerCollapse = setTimeout(function() {
			that.collapse();
		}, this.options.autoCollapseTime);
		return this;		
	},

	collapseDelayedStop: function() {
		clearTimeout(this.timerCollapse);
		return this;		
	},

	_createInput: function (text, className) {
		var content = {
			select:null,
			input:null
		};
		var select = L.DomUtil.create('select', className, this._container);
		var input = L.DomUtil.create('input', className, this._container);
		input.type = 'text';
		input.size = this._inputMinSize;
		input.value = '';
		input.autocomplete = 'off';
		input.autocorrect = 'off';
		input.autocapitalize = 'off';
		input.placeholder = text;
		input.style.display = 'none';
		input.role = 'search';
		input.id = "searchContent";

		select.type = "select";
		select.style.display = 'none';
		select.id = "searchType";
		select.options.add(new Option("名称"));
		select.options.add(new Option("分类"));
		select.options.add(new Option("FID"));

		L.DomEvent
			.disableClickPropagation(input)
			.on(input, 'keyup', this._handleKeypress, this)
			.on(input, 'keydown', this._handleAutoresize, this)
			.on(input, 'blur', this.collapseDelayed, this)
			.on(input, 'focus', this.collapseDelayedStop, this);

		content.select = select;
		content.input = input;

		return content;
	},

	_createButton: function (title, className) {
		var button = L.DomUtil.create('a', className, this._container);
		button.href = '#';
		button.title = title;

		L.DomEvent
			.on(button, 'click', L.DomEvent.stop, this)
			.on(button, 'click', this._handleSubmit, this)			
			.on(button, 'focus', this.collapseDelayedStop, this)
			.on(button, 'blur', this.collapseDelayed, this);

		return button;
	},

	_handleKeypress: function (e) {	//run _input keyup event
		
		switch(e.keyCode)
		{
			case 27: //Esc
				this.collapse();
			break;
			case 13: //Enter
				if(this._countertips == 1)
					this._handleArrowSelect(1);
				this._handleSubmit();	//do search
			break;
			case 38://Up
				this._handleArrowSelect(-1);
			break;
			case 40://Down
				this._handleArrowSelect(1);
			break;
			case 37://Left
			case 39://Right
			case 16://Shift
			case 17://Ctrl
			//case 32://Space
			break;
			case 8://backspace
			case 46://delete
				this._autoTypeTmp = false;//disable temporarily autoType
			break;
			default://All keys

				if(this._input.value.length >= this.options.minLength)
				{
					var that = this;

					clearTimeout(this.timerKeypress);	//cancel last search request while type in				

				}

		}
	},

	_handleAutoresize: function() {	//autoresize this._input
	    //TODO refact _handleAutoresize now is not accurate
	    if (this._input.style.maxWidth != this._map._container.offsetWidth) //If maxWidth isn't the same as when first set, reset to current Map width
	        this._input.style.maxWidth = L.DomUtil.getStyle(this._map._container, 'width');

		if(this.options.autoResize && (this._container.offsetWidth + 45 < this._map._container.offsetWidth))
			this._input.size = this._input.value.length<this._inputMinSize ? this._inputMinSize : this._input.value.length;
	},

	_handleArrowSelect: function(velocity) {
	
		var searchTips = this._tooltip.hasChildNodes() ? this._tooltip.childNodes : [];
			
		for (i=0; i<searchTips.length; i++)
			L.DomUtil.removeClass(searchTips[i], 'search-tip-select');
		
		if ((velocity == 1 ) && (this._tooltip.currentSelection >= (searchTips.length - 1))) {// If at end of list.
			L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select');
		}
		else if ((velocity == -1 ) && (this._tooltip.currentSelection <= 0)) { // Going back up to the search box.
			this._tooltip.currentSelection = -1;
		}
		else if (this._tooltip.style.display != 'none') {
			this._tooltip.currentSelection += velocity;
			
			L.DomUtil.addClass(searchTips[this._tooltip.currentSelection], 'search-tip-select');
			
			this._input.value = searchTips[this._tooltip.currentSelection]._text;

			// scroll:
			var tipOffsetTop = searchTips[this._tooltip.currentSelection].offsetTop;
			
			if (tipOffsetTop + searchTips[this._tooltip.currentSelection].clientHeight >= this._tooltip.scrollTop + this._tooltip.clientHeight) {
				this._tooltip.scrollTop = tipOffsetTop - this._tooltip.clientHeight + searchTips[this._tooltip.currentSelection].clientHeight;
			}
			else if (tipOffsetTop <= this._tooltip.scrollTop) {
				this._tooltip.scrollTop = tipOffsetTop;
			}
		}
	},

	_handleSubmit: function() {	//button and tooltip click and enter submit
		if(this._input.style.display == 'none')	//on first click show _input only
			this.expand();
		else
		{
			if(this._input.value === '')	//hide _input only
				this.collapse();
			else
			{
				var val = this._input.value;
				var type = this._select.value;
				this.searchPoiAround(type,val,this.options.data);
			}
		}
	},
	searchPoiAround:function (type,val,data) {
		
	}
});


L.Map.addInitHook(function () {
    if (this.options.searchControl) {
        this.searchControl = L.control.search(this.options.searchControl);
        this.addControl(this.searchControl);
    }
});

L.control.search = function (options) {
    return new L.Control.Search(options);
};

}).call(this);

