var dinput = function (sel, option, onComplete) {
    option = option || {};
    var $ = function (sel) { return document.querySelectorAll(sel); };
    var DemoConfig = {
        digitKeyLength: option.lenSpec || 6
    };

    var DemoView = {
        digitInputs: [],
        curDigitInput: 0,
        inputState: true, // true: longer, false: shorter
        selectors: {
            digitInputBox: '#inputBox_inputs',
            digitInputs: '#inputBox_inputs input',
            digitInputMask: '#inputBox_mask'
        },
        init: function () {
            DemoView.prepareDigitInputs(DemoConfig.digitKeyLength);
            DemoView.bindEvents();
        },
        bindEvents: function () {
            for (var inputIndex in DemoView.digitInputs) {
                var target = DemoView.digitInputs[inputIndex];

                target.addEventListener('keypress', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);

                    var valid = ((code >= 48 && code <= 57) || code === 8);

                    DemoView.inputState = (code !== 8);
                    DemoView.log('keypress: ' + code);
                    return valid;
                }, false);
                target.addEventListener('keydown', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);

                    var valid = ((code >= 48 && code <= 57) || code === 8);
                    if (!valid) {
                        event.preventDefault();
                        return false;
                    }

                    DemoView.inputState = (code !== 8);
                    if (event, target.value === '' && DemoView.inputState === false) {
                        var curInputIndex = DemoView.curDigitInput;
                        if (curInputIndex > 0) curInputIndex--;
                        DemoView.digitInputs[curInputIndex].focus();
                    }
                }, false);
                target.addEventListener('keyup', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    DemoView.inputState = (code != 8);
                }, false);
                target.addEventListener('paste', function (event) {
                    return false;
                }, false);
                target.addEventListener('focus', function (event) {
                    DemoView.log('focus on: ' + event.target.getAttribute('data-index'), true);
                }, false);

                // text changes:
                target.addEventListener('change', function (event) {
                    DemoView.log('onchange');
                }, false);
                target.addEventListener('input', DemoView.inputTextChangeHandler, false);
            }

            var inputMask = $(DemoView.selectors.digitInputMask)[0];
            inputMask.addEventListener('click', DemoView.inputMaskClickHandler, false);
        },
        inputTextChangeHandler: function (event) {
            var curKey = DemoView.getDigitKeyString();
            var curInputIndex = curKey.length;
            if (DemoView.inputState === true) {
                if (curInputIndex >= DemoConfig.digitKeyLength)
                    curInputIndex = DemoConfig.digitKeyLength - 1;
            } else {
                //if(curInputIndex > 0) curInputIndex--;
            }
            DemoView.log('curInputState: ' + DemoView.inputState.toString());
            DemoView.log('curInputIndex: ' + curInputIndex.toString());

            if (curInputIndex > 0) DemoView.digitInputs[curInputIndex - 1].blur();
            if (curInputIndex < DemoConfig.digitKeyLength - 1) DemoView.digitInputs[curInputIndex + 1].blur();
            DemoView.digitInputs[curInputIndex].focus();

            DemoView.curDigitInput = curInputIndex;
            if (curKey.length >= DemoConfig.digitKeyLength) {
                DemoView.log('current key: ' + curKey, true);
                DemoView.checkKey();
                return;
            }

            $(DemoView.selectors.digitInputTitle)[0].click();
            $(DemoView.selectors.digitInputMask)[0].click();

            window.setTimeout(function () {
                DemoView.digitInputs[DemoView.curDigitInput].focus();
                DemoView.digitInputs[DemoView.curDigitInput].click();
            }, 100);
        },
        inputMaskClickHandler: function (event) {
            window.setTimeout(function () {
                DemoView.digitInputs[DemoView.curDigitInput].focus();
                DemoView.digitInputs[DemoView.curDigitInput].click();
            }, 100);
        },
        getDigitKeyString: function () {
            var keyStr = '';
            for (var i in DemoView.digitInputs) {
                keyStr += DemoView.digitInputs[i].value;
            }
            return keyStr;
        },
        checkKey: function (curKey) {
            DemoController.checkKey(curKey || DemoView.getDigitKeyString());
        },
        prepareDigitInputs: function (keyLength) {
            var $digitInputBox = $(DemoView.selectors.digitInputBox)[0];
            for (var i = 0; i < keyLength; i++) {
                var $input = document.createElement('input');
                $input.setAttribute('data-index', i.toString());
                $input.setAttribute('type', 'tel');
                $input.setAttribute('maxlength', '1');
                $digitInputBox.appendChild($input);
                DemoView.digitInputs[i] = $input;
            }
        },
        log: function (text, force) {
            console.log(text);
        }
    };

    var DemoController = {
        init: function (selector) {
            var $dom = (typeof selector === 'string') ? $(selector)[0] : selector;
            $dom.innerHTML = `
                <div id="inputBox_inputs">
                    <div id="inputBox_mask"></div>
                </div>
            `;
            DemoView.init();
        },
        checkKey: function (curKey) {
            onComplete && onComplete(curKey);
        }
    };
    
    return DemoController.init(sel);
};

if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = dinput;
    }
} else {
    window.digitinput = dinput;
}
