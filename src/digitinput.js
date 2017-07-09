var dinput = function (sel, option, onComplete) {
    option = option || {};
    
    var DemoConfig = {
        digitKeyLength: option.lenSpec || 6
    };
    
    var cssFlag = 'fygniw3tuynwiyrugsn';
    if (!window[cssFlag]) {
        window[cssFlag] = true;
        var addCssRule = function (selectorString, styleString) {
            if (window.document.getElementsByTagName('style').length === 0) {
                var tempStyle = window.document.createElement('style');
                tempStyle.setAttribute('type', 'text/css');
                window.document.getElementsByTagName('head')[0].appendChild(tempStyle);
            }
            window.document.getElementsByTagName('style')[0].appendChild(window.document.createTextNode(selectorString + '{' + styleString + '}'));
        };
        addCssRule('.inputBox_inputs', `position: relative;`);
        addCssRule('.inputBox_mask', `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10;
        `);
        addCssRule('.inputBox_inputs input', `
            text-align: center;
            border-top: 2px solid #ddd;
            border-right: 1px solid #ddd;
            border-bottom: 2px solid #ddd;
            border-left: 1px solid #ddd;
            padding: 0;
            margin: 0;
            outline: none;

            /*-webkit-user-select:none;*/
            /*-moz-user-select: none;*/
            /*-khtml-user-select: none;*/
            /*-ms-user-select:none;*/
            /*user-select: none;*/

            color: transparent;
            display: inline-block;
            font-size: 2rem;
            text-shadow: 0 0 0 gray;
            width: 3.2rem;
            height: 3.2rem;
            line-height: 3.2rem;
        `);
        addCssRule('.inputBox_inputs input:focus', `
            background-color: #ddd;
            outline: none;
        `);
        addCssRule('.inputBox_inputs input:first-of-type', `
            border-left: 2px solid #ddd;
            border-radius: 8px 0 0 8px;
        `);
        addCssRule('.inputBox_inputs input:last-of-type', `
            border-right: 2px solid #ddd;
            border-radius: 0 8px 8px 0;
        `);
    }

    var DemoView = {
        digitInputs: [],
        curDigitInput: 0,
        inputState: true, // true: longer, false: shorter
        selectors: {
            digitInputBox: '.inputBox_inputs',
            digitInputs: '.inputBox_inputs input',
            digitInputMask: '.inputBox_mask'
        },
        init: function ($container) {
            this.$container = $container;
            this.$ = function (sel) {
                return $container.querySelectorAll(sel);
            };
            this.prepareDigitInputs(DemoConfig.digitKeyLength);
            this.bindEvents();
        },
        bindEvents: function () {
            for (var inputIndex in this.digitInputs) {
                var target = this.digitInputs[inputIndex];

                target.addEventListener('keypress', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    DemoView.log('keypress: ' + code);

                    var valid = ((code >= 48 && code <= 57) || code == 8);

                    DemoView.inputState = (code != 8);
                    return valid;
                }, false);
                
                target.addEventListener('keydown', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    DemoView.log('keydown: ' + code);

                    var valid = ((code >= 48 && code <= 57) || code == 8);
                    if (!valid) {
                        event.preventDefault();
                        return false;
                    }

                    DemoView.inputState = (code != 8);
                    if (event.target.value === '' && DemoView.inputState === false) {
                        var curInputIndex = DemoView.curDigitInput;
                        if (curInputIndex > 0) curInputIndex--;
                        DemoView.digitInputs[curInputIndex].focus();
                    }
                }, false);
                
                target.addEventListener('keyup', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    DemoView.log('keyup: ' + code);
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
                target.addEventListener('input', this.inputTextChangeHandler, false);
            }

            this.$(this.selectors.digitInputMask)[0].addEventListener('click', this.inputMaskClickHandler, false);
        },
        inputTextChangeHandler: function (event) {
            var curKey = DemoView.getDigitKeyString();
            var curInputIndex = curKey.length;
            if (DemoView.inputState === true) {
                if (curInputIndex >= DemoConfig.digitKeyLength)
                    curInputIndex = DemoConfig.digitKeyLength - 1;
            } else {
                // if(curInputIndex > 0) curInputIndex--;
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

            DemoView.$(DemoView.selectors.digitInputMask)[0].click();

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
            for (var i in this.digitInputs) {
                keyStr += this.digitInputs[i].value;
            }
            return keyStr;
        },
        checkKey: function (curKey) {
            DemoController.checkKey(curKey || this.getDigitKeyString());
        },
        prepareDigitInputs: function (keyLength) {
            var $digitInputBox = this.$(this.selectors.digitInputBox)[0];
            for (var i = 0; i < keyLength; i++) {
                var $input = window.document.createElement('input');
                $input.setAttribute('data-index', i.toString());
                $input.setAttribute('type', 'tel');
                $input.setAttribute('maxlength', '1');
                $digitInputBox.appendChild($input);
                this.digitInputs[i] = $input;
            }
        },
        log: function (text, force) {
            console.log(text);
        }
    };

    var DemoController = {
        init: function (selector) {
            var $dom = (typeof selector === 'string') ? window.document.querySelector(selector) : selector;
            $dom.innerHTML = `
                <div class="inputBox_inputs">
                    <div class="inputBox_mask"></div>
                </div>
            `;
            DemoView.init($dom);
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
