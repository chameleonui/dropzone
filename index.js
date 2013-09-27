/*jslint nomen: true, node: true */
var $ = require('jquery');
var dot = require('doT');
var Emitter = require('emitter');
var inherit = require('inherit');
var Upload = require('upload');
var indexOf = require('indexof');

var defaults = {
    renderMethod: 'prepend',
    inputUploadUrl: null,
    inputName: 'input-upload',
    inputMultiple: '',
    allowedFileTypes : [],

    template: '<li class="dropzone is-default" id="token_InstanceId"><div class="dropzone-default"><div class="dropzone-default-body">{{=it.defaultState}}</div><div class="dropzone-dragover-body">{{=it.dragoverState}}</div><div class="dropzone-active-area"><input id="token_UploadInputId" type="file" name="token_UploadInputName" token_Multiple></div></div><div class="dropzone-success">{{=it.successState}}</div><a href="#" class="dropzone-error">{{=it.errorState}}</a><div class="dropzone-progress">{{=it.progressState}}</div></li>',

    classes: {

        dropzone: '.dropzone',
        defaultState: '.dropzone-default-body',
        dragoverState: '.dropzone-dragover-body',
        successState: '.dropzone-success',
        errorState: '.dropzone-error',
        progressState: '.dropzone-progress',

        isSuccess: 'is-success',
        isError: 'is-error',
        isDragover: 'is-dragover',
        isProgress: 'is-progress',
        isDefault: 'is-default'
    }
};

function Dropzone(element, options) {
    this.options = options || {};
    var i;
    for (i in defaults) { if (!(this.options[i])) { this.options[i] = defaults[i]; } }

    Emitter.call(this);

    this.instanceId = this._randomID(); // Generate id for single dropzone instance and it's elements
    this.dropzoneId = this.instanceId;
    this.dropzoneInputId = 'input_' + this.instanceId;
    this.dropzoneInputName = this.options.inputName;
    this.dropzoneInputMultiple = this.options.inputMultiple;

    this._errorCheck(this.instanceId); // checkt for some predictable errors

    this.options.template = this._tokenizer(this.options.template); // include tokens into template and return it back to template
    this._tokenizedTemplate = this.options.template;
    this._element = element;
    this._$element = $(this._element);
    this._inputId = '#' + this.dropzoneInputId;
    this._images = null;
    this.xhrResponse = null;
    this.xhrResponseArray = [];
    this.resJson = null;
    this._isVisible = false;
    this._template = null;
    this.fileData = null;
    this._newTemplateData = null;
    this._udatedStates = null;
    this.emmitError = null;

    this._defaultStates = {
        'defaultState' : '{{=it.defaultState}}',
        'dragoverState' : '{{=it.dragoverState}}',
        'successState' : '{{=it.successState}}',
        'errorState' : '{{=it.errorState}}',
        'progressState' : '{{=it.progressState}}'
    };

    this._defaultData = {
        'defaultState' : '<span>Default</span>',
        'dragoverState' : '<span>Place items here</span>',
        'successState' : '<span>Success</span>',
        'errorState' : '<span>Error!</span>',
        'progressState' : '<span>Progress</span>'
    };

    this._compiledTemplate = dot.compile(this._tokenizedTemplate); // fn s překompilovaným doT
    this._dropzoneTemplate = this._compiledTemplate(this._defaultData); // vygenerovaný kpmpletní template

    this._stateTemplates = {
        successState: function() { return '<span>Success</span>'; },
        errorState: function() { return '<span>Error!</span>'; },
        progressState: function() { return '<span>Progress</span>'; },
        defaultState: function() { return '<span>Default</span>'; },
        dragoverState: function() { return '<span>Place items here</span>'; }
    };

    this._onClickError();

}

module.exports = Dropzone;

// Inherit features from Emmiter 
inherit(Dropzone, Emitter);

Dropzone.prototype.show = function() {

    if ($.fn[this.options.renderMethod]) {
        // var templateStates = this._createStateTemplates(stateTemplatesVars),
        //     dropzone = this.create(templateStates);
        // this._$element[this.options.renderMethod](dropzone);
        this._$element[this.options.renderMethod](this._dropzoneTemplate);
    } else {
        throw new Error('Dropzone ID# ' + this.dropzoneId + ': as renderMethod use: prepend | apend | before | after');
    }

    this._isVisible = true;

    this._inputOnChange();
    this._inputOnDragover();
    this._inputOnDragleave();

    this.emit('show');
    return this;
};

Dropzone.prototype.hide = function() {

    // Vanilla JS way
    var dropEl = document.getElementById(this.dropzoneId);
    dropEl.parentNode.removeChild(dropEl);

    this._isVisible = false;
    this.emit('hide');
    return this;
};

Dropzone.prototype.cusomizeTemplate = function(templateData, data) {
    if (typeof templateData === 'object' && typeof data === 'object') {
        this._templateUpdate(templateData);
        this._templateBuild(data);
    } else {
        throw new Error('Dropzone ID# ' + this.dropzoneId + ': to customizeTemplate you have to insert proper data objects');
    }

    return this;
};

Dropzone.prototype._templateUpdate = function(templateData) {
    var i;
    for (i in this._defaultStates) {
        if (!(templateData[i])) {
            templateData[i] = this._defaultStates[i];
        }
    }
    this._udatedStates = templateData; // fill object _updatedState with new data
    this._compiledTemplate = this._compiledTemplate(templateData);

    return this;
};

Dropzone.prototype._templateBuild = function(data) {
    var temp = dot.compile(this._compiledTemplate);
    var i;
    for (i in this._defaultData) {
        if (!(data[i])) {
            data[i] = this._defaultData[i];
        }
    }

    this._dropzoneTemplate = temp(data);

    return this;
};

Dropzone.prototype.updateState = function(stateName, stateData, stateTemplate) {
    var _thisStateTemplate;
    var _thisStateData;
    var _thisUpdatedState;

    if (this._isVisible) {

        if (typeof stateData === 'object') {
            _thisStateData = stateData;

            if (!stateTemplate) {
                if (typeof this._udatedStates === 'object') {
                    _thisStateTemplate = this._udatedStates[stateName];
                } else {
                    _thisStateTemplate = this._defaultStates[stateName];
                }
            }

            if (typeof stateTemplate === 'string') {
                _thisStateTemplate = stateTemplate
            }
        }

        _thisUpdatedState = dot.compile(_thisStateTemplate);
        _thisUpdatedState = _thisUpdatedState(_thisStateData);

        $('#' + this.dropzoneId).find(this.options.classes[stateName]).html(_thisUpdatedState);
    }
    return this;
};

Dropzone.prototype.toggleState = function(className) {
    // the Vanilla JS way
    var dropzoneId = document.getElementById(this.dropzoneId);
    if (dropzoneId) {
        dropzoneId.removeAttribute('class');
        dropzoneId.setAttribute('class', this.options.classes.dropzone.replace('.', '') + ' ' + className.replace('.', ''));
    }
    return this;
};

Dropzone.prototype._tokenizer = function(htmlTemplate) {
    var i;
    var tokenMap = [
        { "find": "token_InstanceId",       "replaceBy" : this.dropzoneId },
        { "find": "token_UploadInputId",    "replaceBy" : this.dropzoneInputId },
        { "find": "token_UploadInputName",  "replaceBy" : this.dropzoneInputName },
        { "find": "token_Multiple",         "replaceBy" : this.dropzoneInputMultiple }
    ];

    for (i = tokenMap.length - 1; i >= 0; i--) {
        htmlTemplate = htmlTemplate.replace(new RegExp(tokenMap[i].find, 'g'), tokenMap[i].replaceBy);
    };

    return htmlTemplate;
};

// -------------------
// Uploading functions
// -------------------

Dropzone.prototype._onUploadProgress = function(event) {
    // console.log(event.percent);
    this.toggleState(this.options.classes.isProgress);

    this.emit('uploadProgress');
    return this;
};

Dropzone.prototype._onUploadError = function(event) {
    var errorMsg = (this.xhrResponse === null) ? 'Error!' : (this.resJson.statusText === null) ? 'Error!' : this.resJson.statusText;

    this.updateState('errorState', {errorState: errorMsg });
    this.toggleState(this.options.classes.isError)._resetInputFile();

    this.emmitError = errorMsg;
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

            this.xhrResponseArray.push(this.resJson);
            this.toggleState(this.options.classes.isSuccess);

            setTimeout(function() {
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
    var denied = [];
    var i;
    var uploadInput = document.getElementById(this.dropzoneInputId);
    // this._input = document.querySelector('#' + this.dropzoneInputId);
    this.xhrResponseArray = [];

    for (i = uploadInput.files.length - 1; i >= 0; i--) {

        file = uploadInput.files[i];
        this.fileData = file;

        // checkt if i have set allowedFileTypes
        if (this.options.allowedFileTypes.length > 0) {
            // and if so, checkt if files droper for input are eligible to upload
            if (indexOf(this.options.allowedFileTypes, file.type) >= 0 ) {
                this._uploadObject(file);
            } else {
                // in case i wan to store names of denied files
                denied.push(file.name);
            }
        } else {
            this._uploadObject(file);
        }
    }

    // in case i wan to show stored denied files
    if (denied.length > 0) {
        // fixed when draging not allowed file over dropone to change it's state back to default
        this.toggleState(this.options.classes.isDefault)._resetInputFile();

        // var deniedLog = denied.slice(', ');
        // deniedLog = deniedLog.toString();
        // console.log(deniedLog);
    }

    this.emit('uploadBegin');
    return this;
};

Dropzone.prototype._uploadObject = function(file) {
    var _this = this, upload;

    upload = new Upload(file);
    upload.to(this.options.inputUploadUrl);

    upload.on('progress', function(e) {
        _this._onUploadProgress(e);
    });

    upload.on('end', function(res) {
        _this._onUploadEnd(res);
    });

    upload.on('error', function(e) {
        _this._onUploadError(e);
    });
};

// -------------------
// Event functions
// -------------------

Dropzone.prototype._inputOnChange = function() {
    var _this = this;
    $(this._inputId).on('change', function(e) {
        e.preventDefault();
        _this._uploadFiles();
    });
    return this;
};

Dropzone.prototype._inputOnDragover = function() {
    var _this = this;
    $(this._inputId).on('dragenter', function(e) {
        // e.preventDefault();
        _this.toggleState(_this.options.classes.isDragover);
    });
    return this;
};

Dropzone.prototype._inputOnDragleave = function() {
    var _this = this;
    $(this._inputId).on('dragleave', function(e) {
        // e.preventDefault();
        _this.toggleState(_this.options.classes.isDefault);
    });
    return this;
};

// -------------------
// Other functions
// -------------------

Dropzone.prototype._onClickError = function() {
    $('body').on('click', '#' + this.dropzoneId + ' > ' + this.options.classes.errorState, this, function(e) {
        e.preventDefault();
        e.data.toggleState(e.data.options.classes.isDefault)._resetInputFile();
    });

    return this;
};

Dropzone.prototype._resetInputFile = function() {
    // A bit dirty solution but works everywhere
    var $inputFileID = $(this._inputId);
    $inputFileID.replaceWith($inputFileID = $inputFileID.clone(true));

    return this;
};

Dropzone.prototype._randomID = function() {
    return Math.random().toString(36).slice(2);
};

// error check for typical predictable errors
Dropzone.prototype._errorCheck = function(instanceId) {
    var instance = 'Object Dropzone ID:' + instanceId + ': ';
    if (this.options.inputUploadUrl === null) {
        return console.error(instance + 'inputUploadUrl must not be null! You have to set it in options');
    }
};
