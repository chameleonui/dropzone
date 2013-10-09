# Dropzone

Provides skinable UI component for files upload with support for Drag 'n' Drop.

## Installation

Install with [component](http://component.io):

```sh
$ component install chameleonui/dropzone
```


## API

```js
new Dropzone(element, options);
```

element - selector of element where should be dropzone placed
option - definable options

Dropzone has 5 states:

* defaultState
* dragoverState
* successState
* errorState
* progressState

and their 5 default state messages:

* defaultMsg
* dragoverMsg
* successMsg
* errorMsg
* progressMsg


### Default values and Dropzone options are:

```js
var options = {
    renderMethod: 'prepend',    // prepend | append | before | after
    inputUploadUrl: null,       // set url
    inputName: '',              // optional, set input name
    inputMultiple: '',          // optional, multiple | ''
    allowedFileTypes : []       // optional, ['image/jpeg', 'image/png'] | []
};
```


## Functions

### Dropzone.show(stateTempaltesVars:object)

Build Dropzone templates and show Dropzone in DOM.

### Dropzone.hide()

Remove Dropzone from DOM;

### Dropzone.cusomizeTemplate(templateData:object DoT, statesData:object)

Customize default dropzone theme with own custom templateData and it's statesData

### Dropzone.updateState(stateName:string, stateData:object [, stateTemplate:string doT])

Updates state compiled template using new data.

### Dropzone.toggleState(className:stringCssClass)

Swith beetween active state classes like e.g.'is-error'



## Back-end API

On back-end, dropzone need to get JSON with `status` and `statusText`, which is it using for testing and firing success or error.

```
POST /image/upload
< 200
< Content-Type: application/json
{
    "status": 200,
    "statusText": "OK"
}
```

Example back-end API for image upload.

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


## Feature plans

* On multiple file upload, add `uploadAllEnd` and fire it after ended uploading all files
* Done :) ~~Refactore theme rendering and it's updating.~~
* Added own functions for `renderMethod` option

and.. if it will be possible

* make Dropzone as jQuery free as it is possible :) (yeah! that's challenge)


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
