# Inpage-log Function

An simple inpage-log function, 

## How to install
Just download the folder and add the following line to your HTML file. Configure your path.

```javascript
<script src="libs/inpage-log/inpage-log-1.1.0.js"></script>
```

## How to use
```log()``` is a global function (```window.log()```), so you can use it as:

```javascript
log('hello world);
log('default', 'a default message');
log('error', 'an error in red');
log('success', 'some friendly green message);
log('warning', 'a yellow text for ...');
```