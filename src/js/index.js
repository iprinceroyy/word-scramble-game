"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_words_1 = require("random-words");
var randomWordsContainer = document.querySelector('.random__words__container');
var randomBtn = document.querySelector('.btn--random');
var resetBtn = document.querySelector('.btn--reset');
var matchedWordsContainer = document.querySelector('.matched__words__container');
var triesEle = document.querySelector('.tries');
var dots = document.querySelectorAll('.dot');
var wrongChars = document.querySelectorAll('.char--wrong');
var App = (function () {
    function App() {
        this.word = '';
        this.totalTries = 0;
        this._renderInitial();
        if (randomBtn instanceof HTMLButtonElement && resetBtn instanceof HTMLButtonElement) {
            randomBtn.addEventListener('click', this._handleRandomBtnClick.bind(this));
            resetBtn.addEventListener('click', this._handleReset.bind(this));
        }
    }
    App.prototype._renderInitial = function () {
        this._generateRandomWords();
        this._generateBlankBoxes();
        this._focusNextElement();
    };
    App.prototype._handleRandomBtnClick = function () {
        this._generateRandomWords();
        this._generateBlankBoxes();
        this._focusNextElement();
    };
    App.prototype._handleReset = function () {
        this._renderInitial();
        this._clearDots();
    };
    App.prototype._rearrangeLettersRandomly = function () {
        var len = this.word.length;
        var randomStr = '';
        if (typeof this.word === 'string') {
            randomStr += this.word.substring(len / 2);
            randomStr += this.word.substring(0, len / 2);
            randomStr = randomStr.split('').reverse().join('');
        }
        return randomStr;
    };
    App.prototype._generateRandomWords = function () {
        if (typeof this.word === 'string')
            this.word = (0, random_words_1.generate)();
        if (this.word.length < 3 || this.word.length > 6) {
            while (this.word.length < 3 || this.word.length > 6) {
                this.word = (0, random_words_1.generate)();
            }
        }
        if (randomWordsContainer instanceof HTMLParagraphElement)
            randomWordsContainer.innerHTML = "<span>".concat(this._rearrangeLettersRandomly(), "</span>");
    };
    App.prototype._generateBlankBoxes = function () {
        if (typeof this.word === 'string' && matchedWordsContainer instanceof HTMLFormElement) {
            matchedWordsContainer.innerHTML = '';
            matchedWordsContainer.innerHTML = "\n  \n    ".concat(this.word
                .split('')
                .map(function (letter, i) {
                return "<input type=\"text\" class=\"letter__container\" maxLength=\"1\" aria-label=".concat(letter, " required />");
            })
                .join(''), "\n    ");
        }
        if (matchedWordsContainer instanceof HTMLFormElement)
            matchedWordsContainer.style.gridTemplateColumns = "repeat(".concat(this.word.length, ", 1fr)");
    };
    App.prototype._focusNextElement = function () {
        var _this = this;
        var inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
        inputs.forEach(function (input) {
            input.addEventListener('keydown', function (event) {
                if (event.key === 'Backspace')
                    return;
                if (input.value.length >= input.maxLength) {
                    event.preventDefault();
                    _this._focusNext(inputs);
                }
            });
        });
    };
    App.prototype._focusNext = function (inputs) {
        var currInput = document.activeElement;
        if (currInput instanceof HTMLInputElement) {
            var currInputIndex = inputs.indexOf(currInput);
            var nextinputIndex = (currInputIndex + 1) % inputs.length;
            var input = inputs[nextinputIndex];
            if (currInput.ariaLabel === currInput.value) {
                if (nextinputIndex == 0 && this.totalTries <= 5) {
                    alert('🎉 Success');
                    return;
                }
                input.focus();
                input.placeholder = '_';
            }
            else {
                currInput.classList.add('flipInY');
                setTimeout(function () {
                    currInput.classList.remove('flipInY');
                }, 500);
                currInput.placeholder = '_';
                this._checkAnswers();
                this._showMistakes(currInput.value);
                currInput.value = '';
            }
        }
    };
    App.prototype._checkAnswers = function () {
        this.totalTries += 1;
        if (this.totalTries > 5) {
            this.totalTries = 0;
            this._generateRandomWords();
            this._generateBlankBoxes();
            this._updateTriesElement();
            this._clearMistakesContainer();
            this._clearDots();
            return;
        }
        this._updateTriesElement();
        dots[this.totalTries - 1].classList.add('active');
    };
    App.prototype._updateTriesElement = function () {
        if (triesEle instanceof HTMLParagraphElement)
            triesEle.innerHTML = "Tries(<span>".concat(this.totalTries, "</span>/5):");
    };
    App.prototype._showMistakes = function (userInput) {
        if (this.totalTries - 1 == 5)
            return;
        wrongChars[this.totalTries - 1].textContent = "".concat(userInput, ", ");
    };
    App.prototype._clearDots = function () {
        dots.forEach(function (dot) { return dot.classList.remove('active'); });
    };
    App.prototype._clearMistakesContainer = function () {
        wrongChars.forEach(function (char) { return (char.textContent = ''); });
    };
    return App;
}());
new App();
//# sourceMappingURL=index.js.map