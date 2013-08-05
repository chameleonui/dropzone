
# dropdown

  Dropdown nav for Chameleon UI

## Installation

  Install with [component(1)](http://component.io):

    $ component install chameleonui/dropdown

## API

new Dropzone(element, options);

this._isVisible = false;
this._dropzoneTemplate = null;
this._statesTemplate = {
	default: null,
	success: null,
	error: null,
	progress: null,
	dragover: null
};
options = {
	renderMethod: 'prepend'
};

Dropzone.show():this

Dropzone.hide():this

Dropzone.template(template:stringDoT):function

Dropzone.create([item:object]):stringHtml

Dropzone.templateSucces(template:stringDoT):stringHtml

Dropzone.templateError(template:stringDoT):stringHtml

Dropzone.templateProgress(template:stringDoT):stringHtml

Dropzone.templateDefault(template:stringDoT):stringHtml

Dropzone.templateDragover(template:stringDoT):stringHtml


var defaults = {
    template: "<li class='dropzone is-default'><div class='dropzone-default'><div class='dropzone-default-body'>{{=it.default()}}</div><div class='dropzone-dragover-body'><i class='icon-plus'></i><div class='dropzone-icon-title'>Place items here</div></div><div class='dropzone-active-area'><input id='dropzone-fileupload' type='file' name='files[]' multiple></div></div><div class='dropzone-success'>{{=it.success()}}</div><div class='dropzone-error'>{{=it.error()}}</div><div class='dropzone-progress'>{{=it.progress()}}</div></li>",
    renderMethod: 'prepend',
    uploadInputId: 'dropzone-fileupload',
    uploadUrl: null,
    classes: {
    	dropzone: '.dropzone',
    	success: '.dropzone-success',
    	error: '.dropzone-error',
    	progress: '.dropzone-progress',
    	default: '.dropzone-default .dropzone-default-body',
    	isSuccess: 'is-success',
    	isError: 'is-error',
    	isDragover: 'is-dragover',
    	isProgress: 'is-progress',
    	isDefault: 'is-default'
    }
};

new Dropzone(element, options)

Dropzone.show()

Dropzone.hide()

Dropzone.template(template:stringDoT):function

Dropzone.create()

Dropzone.templateState(name, template, data)

Dropzone.updateState(name, data)

Dropzone.toggleState(className)

Dropzone._onUploadProgress(event)

Dropzone._onUploadError(event)

Dropzone._onUploadEnd(res)

Dropzone._uploadFiles()

Dropzone._inputOnChange()

Dropzone._inputOnDragover()

Dropzone._inputOnDragleave()


## License

  MIT
