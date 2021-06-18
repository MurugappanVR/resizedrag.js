# resizedrag.js
Tiny js library to make DOM elements movable and resizable . [Demo Here](https://murugappanvr.github.io/resizedrag.js/) . This library has added resizing functionalities to the existing [dragdrop.js](https://github.com/knadh/dragmove.js) .

## Getting started

Installing resize drag,

```sh
npm install resizedrag
```
```sh
import { resizedrag } from 'resizedrag';

// (target, handler, onStart(target, x, y), onEnd(target, x, y)).
// onStart and onEnd are optional callbacks that receive target element, and x, y coordinates.
resizedrag(document.querySelector("#box"), document.querySelector("#box .drag-handle"));
```
## Usage
Sample element in the html which has enabled resizedrag
```sh
<div class="drag-widget-container" id="test" data-rd-drag-enabled="false" data-rd-min-height=25 data-rd-min-width=25 data-rd-drag-boder-enabled="false">
</div>
```
Various attributes defined in the element above are explained below,

#### data-rd-drag-enabled :
enable|disable drag for the dom element , default option is true .
```sh
data-rd-drag-enabled="false" 
```
#### data-rd-resize-enabled :
enable|disable resize for the dom element , default option is true .
```sh
data-rd-resize-enabled="false" 
```
#### data-rd-min-width :
Minimum resizeble width of the the dom element, default value is 5(in pixels) .
```sh
data-rd-min-width=25
```
#### data-rd-min-height :
Minimum resizeble height of the the dom element, default value is 5(in pixels) .
```sh
data-rd-min-height=25
```
#### data-rd-drag-boder-enabled :
Option to show border in the element which is being dragged , default value is true .
```sh
data-rd-drag-boder-enabled="false"
```
## License

MIT


