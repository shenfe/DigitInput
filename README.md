# DigitInput
A lightweight digit-input component for mobile frontend, where users are required to input a length-specific digit string.

## Demo
[Demo](http://shenfe.github.io/repos/DigitInput/demo.html)

## Usage
```html
<div id="inputBox_wrapper"></div>
<script>
    window.onload = function () {
        digitinput('#inputBox_wrapper', {
            lenSpec: 6
        }, function (s) {
            alert('You input: ' + s);
        });
    };
</script>
```
