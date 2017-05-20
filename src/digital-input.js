var dinput = function (sel) {
    var $ = function (sel) { return document.querySelectorAll(sel); };
    var DemoConfig = {
        fakedata: true,
        fakedataDelay: 2000,
        digitKeyLength: 6
    };

    var DemoView = {
        digitInputs: [],
        curDigitInput: 0,
        inputState: true, // true: longer, false: shorter
        selectors: {
            digitInputBox: '#inputBox_inputs',
            digitInputs: '#inputBox_inputs input',
            digitInputMask: '#inputBox_mask',
            digitInputTitle: '#inputBox_title'
        },
        getDigitInputTitle: function () {
            return 'Enter ' + DemoConfig.digitKeyLength.toString() + '-digit key:';
        },
        init: function () {
            DemoView.prepareDigitInputs(DemoConfig.digitKeyLength);
            DemoView.bindEvents();
        },
        bindEvents: function () {
            for (var inputIndex in DemoView.digitInputs) {
                var target = DemoView.digitInputs[inputIndex];

                addEvent(target, 'keypress', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);

                    var valid = ((code >= 48 && code <= 57) || code == 8);

                    DemoView.inputState = (code != 8);
                    DemoView.log('keypress: ' + code);
                    return valid;
                }, false);
                addEvent(target, 'keydown', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);

                    var valid = ((code >= 48 && code <= 57) || code == 8);
                    if (!valid) {
                        event.preventDefault();
                        return false;
                    }

                    DemoView.inputState = (code != 8);
                    if (event, target.value == '' && DemoView.inputState === false) {
                        var curInputIndex = DemoView.curDigitInput;
                        if (curInputIndex > 0) curInputIndex--;
                        DemoView.digitInputs[curInputIndex].focus();
                    }
                }, false);
                addEvent(target, 'keyup', function (event) {
                    var code = (event.keyCode ? event.keyCode : event.which);
                    DemoView.inputState = (code != 8);
                }, false);
                addEvent(target, 'paste', function (event) {
                    return false;
                }, false);
                addEvent(target, 'focus', function (event) {
                    DemoView.log('focus on: ' + event.target.getAttribute('data-index'), true);
                }, false);

                // text changes:
                addEvent(target, 'change', function (event) {
                    DemoView.log('onchange');
                }, false);
                if ("\v" == "v") { // IE
                    target.onpropertychange = DemoView.inputTextChangeHandler;
                } else {
                    target.addEventListener('input', DemoView.inputTextChangeHandler, false);
                }
            }

            var inputMask = $(DemoView.selectors.digitInputMask)[0];
            addEvent(inputMask, 'click', DemoView.inputMaskClickHandler, false);
            //addEvent(inputMask, 'touchstart', DemoView.inputMaskClickHandler, false);
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


            setTimeout(function () {
                DemoView.digitInputs[DemoView.curDigitInput].focus();
                DemoView.digitInputs[DemoView.curDigitInput].click();
            }, 100);

        },
        inputMaskClickHandler: function (event) {
            setTimeout(function () {
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
            if (arguments.length == 0) curKey = DemoView.getDigitKeyString();
            console.log('checking');
            DemoController.checkKey(curKey);
        },
        prepareDigitInputs: function (keyLength) {
            $(DemoView.selectors.digitInputTitle)[0].innerHTML = (DemoView.getDigitInputTitle());
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
            var $dom = $(selector)[0];
            $dom.innerHTML = `
                <div id="inputBox_title"></div>
                <div id="inputBox_inputs">
                    <div id="inputBox_mask"></div>
                </div>
            `;
            DemoView.init();
        },
        checkKey: function (curKey) {
            if (!curKey) curKey = DemoView.getDigitKeyString();
            setTimeout(function () {
                if (curKey === '123456') {
                    console.log('right');
                } else {
                    console.log('wrong');
                }
            }, DemoConfig.fakedataDelay);
        }
    };
    
    return DemoController.init(sel);
};