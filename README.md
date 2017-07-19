# DigitInput
A pop UX design where users are required to input a digit string of a certain length.

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
