var $ = require('jquery');
var dot = require('doT');
var Emitter = require('emitter');
var inherit = require('inherit');
var Upload = require('upload');

module.exports = Dropzone;

var defaults = {
    template: "<li class='dropzone is-default'><div class='dropzone-default'><div class='dropzone-default-body'>{{=it.defaultState}}</div><div class='dropzone-dragover-body'><i class='icon-plus'></i><div class='dropzone-icon-title'>Place items here</div></div><div class='dropzone-active-area'><input id='dropzone-fileupload' type='file' name='{{=it.inputName}}' {{=it.multiple}}></div></div><div class='dropzone-success'>{{=it.successState}}</div><a href='#' class='dropzone-error'>{{=it.errorState}}</a><div class='dropzone-progress'>{{=it.progressState}}</div></li>",
    renderMethod: 'prepend',
    uploadInputId: 'dropzone-fileupload',
    uploadUrl: null,
    classes: {
        dropzone: '.dropzone',
        successState: '.dropzone-success',
        errorState: '.dropzone-error',
        progressState: '.dropzone-progress',
        defaultState: '.dropzone-default .dropzone-default-body',
        isSuccess: 'is-success',
        isError: 'is-error',
        isDragover: 'is-dragover',
        isProgress: 'is-progress',
        isDefault: 'is-default'
    }
};

function Dropzone(element, options) {
	this.options = options || {};
	for (var i in defaults) {
		if (!(this.options[i])) this.options[i] = defaults[i];
	}
	Emitter.call(this);
	this._element = element;
	this._$element = $(this._element);
	this._input = null;
	this._inputId = '#'+this.options.uploadInputId;
	this._images = null;
	this.xhrResponse = null;
	this.resJson = null;

	this._isVisible = false;
	this._template = null;
	this._stateTemplates = {
		successState: function(it){return '<span>Success</span>'},
		errorState: function(it){return '<span>Error!</span>'},
		progressState: function(it){return '<span>Progress</span>'},
		defaultState: function(it){return '<span>Default</span>'},
		multiple: function(it){return 'multiple'},
		inputName: function(it){return 'inputName'}
	};

	this.template();
	this._onClickError();
}

// Inherit features from Emmiter 
inherit(Dropzone, Emitter);

Dropzone.prototype.show = function(stateTemplatesVars) {
	
	if ($.fn[this.options.renderMethod]) {
		var templateStates = this._createStateTemplates(stateTemplatesVars);
		var dropzone = this.create(templateStates);
        this._$element[this.options.renderMethod](dropzone);
    }

	this._isVisible = true;

	this._inputOnChange();
	this._inputOnDragover();
	this._inputOnDragleave();

    this.emit('show');
	return this;
};

Dropzone.prototype.hide = function() {
	this._$element.children(this.options.classes.dropzone).remove();
	this._isVisible = false;
    this.emit('hide');
	return this;
};

Dropzone.prototype.template = function(dotTemplate) {
	this._template = dot.template(dotTemplate || this.options.template);
	return this._template;
};

Dropzone.prototype.create = function(stateTemplates) {
	return this._template(stateTemplates);
};

Dropzone.prototype._createStateTemplates = function(teplatesVars) {
	var result = {};
	teplatesVars = teplatesVars || {};
	for (var key in this._stateTemplates) {
		if (teplatesVars[key]) {
			result[key] = this._stateTemplates[key](teplatesVars[key]);
		} else {
			result[key] = this._stateTemplates[key]();
		}
	}
	return result;
};

Dropzone.prototype.templateStates = function(templates) {
	for (key in templates){
		var name = key,
			template = templates[key].template,
			data = templates[key].data || null;
		this.templateState(name, template, data);
	}
	return this._stateTemplates;
};

Dropzone.prototype.templateState = function(name, template, data) {
	this._stateTemplates[name] = dot.template(template);
	if (this._isVisible) {
		this.updateState(name, data);
	}
	return this._stateTemplates[name];
};

Dropzone.prototype.updateState = function(name, data) {
	if (this._isVisible) {
		this._$element.children(this.options.classes.dropzone)
		.find(this.options.classes[name]).html(this._stateTemplates[name](data));
	}
	return this._stateTemplates[name](data);
};

Dropzone.prototype.toggleState = function(className) {
	this._$element.children(this.options.classes.dropzone)
	.attr('class', this.options.classes.dropzone.replace('.','')+' '+className.replace('.',''));
	return this;
};

// -------------------
// Uploading functions
// -------------------

Dropzone.prototype._onUploadProgress = function(event) {
	this.updateState('progressState', {percent: event.percent});
	this.toggleState(this.options.classes.isProgress);

	this.emit('uploadProgress');
	return this;
};

Dropzone.prototype._onUploadError = function(event) {
	this.updateState('errorState', {errorMsg: (this.xhrResponse === null) ? 'Error!' : (this.resJson.statusText === null) ? 'Error!' : this.resJson.statusText });
	this.toggleState(this.options.classes.isError)._resetInputFile();

	this.emit('uploadError');
	return this;
};

Dropzone.prototype._onUploadEnd = function(res) {
	var _this = this;
	this.xhrResponse = res;

	if (this.xhrResponse.status === 200) {
		// test if I get error status in response msg
		this.resJson = JSON.parse(this.xhrResponse.response);
		if (this.resJson.status === 200) {
			this.toggleState(this.options.classes.isSuccess);
			setTimeout(function(){
				_this.toggleState(_this.options.classes.isDefault)._resetInputFile();
			}, 1000);
			this.emit('uploadEnd');
		} else {
			this._onUploadError();
		}
	} else {
		this._onUploadError();
	}

	return this;
};

Dropzone.prototype._uploadFiles = function() {
	var _this = this;
	this._input = document.getElementById(this.options.uploadInputId);

	for(var i = 0; i < this._input.files.length; ++i) {
		
		var file = this._input.files[i];

		var upload = new Upload(file);
		upload.to(this.options.uploadUrl, function(e){
			_this._onUploadError(e);
		});

		upload.on('progress', function(e){
			_this._onUploadProgress(e);
		});

		upload.on('end', function(res){
			_this._onUploadEnd(res);
		});

       upload.on('error', function(e){
			_this._onUploadError(e);
		});
	}

	this.emit('uploadBegin');
	return this;
};

Dropzone.prototype._inputOnChange = function() {
	var _this = this;
	$(this._inputId).on('change', function(e){
		e.preventDefault();
		_this._uploadFiles();
	});
	return this;
};

Dropzone.prototype._inputOnDragover = function() {
	var _this = this;
	$(this._inputId).on('dragover', function(e){
        e.preventDefault();
		_this.toggleState(_this.options.classes.isDragover);
	});
	return this;
};

Dropzone.prototype._inputOnDragleave = function() {
	var _this = this;
	$(this._inputId).on('dragleave', function(e){
        e.preventDefault();
		_this.toggleState(_this.options.classes.isDefault);
	});
	return this;
};

Dropzone.prototype._onClickError = function() {
	$('body').on('click', this.options.classes.dropzone+' > '+this.options.classes.errorState, this, function(e){
		e.preventDefault();
		e.data.toggleState(e.data.options.classes.isDefault)._resetInputFile();
	});

	return this;
};

Dropzone.prototype._resetInputFile = function() {
	// A bit dirty solution but works everywhere
	var $inputFileID = $(this._inputId);
	$inputFileID.replaceWith( $inputFileID = $inputFileID.clone( true ) );

	return this;
};