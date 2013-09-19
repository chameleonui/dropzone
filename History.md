## v2

### v2.0.0

* refactored js
* Dropzone can now run multiple instances on one page
* Every Dropzone object instance is now marked with it's own generated ID
* Refactored object Options
* added optional setting `allowedFileTypes` to Options
* xhr from uploaded files are stored also in `xhrResponseArray` array, since uploading another file/files on same Dropzone instance
* updated Readme.md


---
## v1

### v1.3.0

* Fixed reserved names
* Added back-end api json
* JSLinted a index.js file a bit

### 1.2.0

* Fixed previous merge
* Input file is now reseting
* Test if I get ohter status than 200 in response from server
* Error state is now reversible to default state on click

### 1.1.0

* Fixed state templates issues
* Added ~~Dropzone.stateTemplates()~~ Dropzone.templateStates() function
* Improved example.html to show new features

### 1.0.0

* First public release