# Dropzone

Provides skinable UI component for files upload

## Installation

Install with [component](http://component.io):

```sh
$ component install chameleonui/dropzone
```

## API

```js
new Dropzone(element, options);
```

Dropzone has 4 major states:
- default
- progress
- success
- error

and default state may have minor state isDragover enabled by CSS class.

### Default values and Dropzone options are:

```js
var options = {
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
```

### Back-end API

```
POST /image/upload
< 200
< Content-Type: application/json
{
    "status": 200,
    "statusText": "OK",
    "image":
        {
            "delete_url": "/image/delete/55fb4e69-a81b-4263-a117-a37b1a8bc33a",
            "edit_url": "/image/edit/55fb4e69-a81b-4263-a117-a37b1a8bc33a",
            "description": "There is a Hypno Toad",
            "filename": "toad.jpg",
            "id": "55fb4e69-a81b-4263-a117-a37b1a8bc33a",
            "mimetype": "image/jpg",
            "size": 150703,
            "title": "The Hypno Toad",
            "url": "images/toad.jpg",
            "url_thumbnail":"images/thumb/toad.jpg"
        }
}
```

## Functions

### Dropzone.show(stateTempaltesVars:object)

Build Dropzone templates and show Dropzone in DOM.

### Dropzone.hide()

Remove Dropzone from DOM;

### Dropzone.template(template:stringDoT):function

Replace Dropzone main template

### Dropzone.create(stateTemplates:stringHtml):stringHtml

Build and return Dropzone HTML

### Dropzone.templateStates(templates:object)

Sets/updates multiple state templates:

```js
drop.templateStates({
    'successState': {
        template: '<strong>{{=it.successMsg}}</strong>', 
        data: { successMsg: 'Yahoooo!' }
    },
    'progressState': {
        template: '<div class="progress-bar" style="width:{{=it.percent}}%;"></div>',
        data: { percent: 0 }
    }
});
```

### Dropzone.templateState(name:string, template:stringDoT[, data:object])

Sets/updates single state template by name – data must be set when template is using variable(s) and
when Dropzone is allready visibe (attached to DOM).

### Dropzone.updateState(name, data)

Updates state template using new data.

### Dropzone.toggleState(className:stringCssClass)

Swith beetween active state classes like e.g.'is-error'


## Author(s)

[Edgedesign s.r.o.](http://www.edgedesing.cz) – [Daniel Sitek](https://github.com/danielsitek), [Tomáš Kuba](https://github.com/tomaskuba)

## License

The MIT License (MIT)

Copyright © 2013 Edgedesign s.r.o.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
