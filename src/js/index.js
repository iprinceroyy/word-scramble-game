"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var random_words_1 = require("random-words");
var js_confetti_1 = __importDefault(require("js-confetti"));
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
        this._focusNextElement();
        if (randomBtn instanceof HTMLButtonElement && resetBtn instanceof HTMLButtonElement) {
            randomBtn.addEventListener('click', this._handleRandomBtnClick.bind(this));
            resetBtn.addEventListener('click', this._handleReset.bind(this));
        }
    }
    App.prototype._renderInitial = function () {
        this._generateRandomWords();
        this._createBlankBoxes();
        this._updateLeftTriesElement();
        this._clearDots();
        this._clearMistakesContainer();
        randomWordsContainer === null || randomWordsContainer === void 0 ? void 0 : randomWordsContainer.classList.add('puffInAnimation');
        matchedWordsContainer === null || matchedWordsContainer === void 0 ? void 0 : matchedWordsContainer.classList.add('zoomInAnimation');
        setTimeout(function () {
            var firstInputElement = matchedWordsContainer === null || matchedWordsContainer === void 0 ? void 0 : matchedWordsContainer.children[0];
            if (firstInputElement instanceof HTMLInputElement)
                firstInputElement.focus();
        }, 1500);
    };
    App.prototype._handleRandomBtnClick = function () {
        this._generateRandomWords();
        this._createBlankBoxes();
    };
    App.prototype._handleReset = function () {
        this._renderInitial();
    };
    App.prototype._rearrangeLettersRandomly = function () {
        var len = this.word.length;
        var randomStr = '';
        if (typeof this.word === 'string') {
            randomStr = this.word.substring(len / 2) + this.word.substring(0, len / 2);
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
        this._addMarkup();
    };
    App.prototype._addMarkup = function () {
        if (randomWordsContainer instanceof HTMLParagraphElement)
            randomWordsContainer.innerHTML = "<span>".concat(this._rearrangeLettersRandomly(), "</span>");
    };
    App.prototype._createBlankBoxes = function () {
        if (typeof this.word === 'string' && matchedWordsContainer instanceof HTMLFormElement) {
            matchedWordsContainer.innerHTML = '';
            matchedWordsContainer.innerHTML = "\n  \n    ".concat(this.word
                .split('')
                .map(function (letter) {
                return "<input type=\"text\" class=\"letter__container\" maxLength=\"1\" aria-label=".concat(letter, " required />");
            })
                .join(''), "\n    ");
        }
        if (matchedWordsContainer instanceof HTMLFormElement)
            matchedWordsContainer.style.gridTemplateColumns = "repeat(".concat(this.word.length, ", 1fr)");
    };
    App.prototype._focusNextElement = function () {
        var _this = this;
        if (matchedWordsContainer instanceof HTMLFormElement) {
            matchedWordsContainer.addEventListener('input', function (event) {
                if (event.target instanceof HTMLInputElement &&
                    event.target.value.length === event.target.maxLength) {
                    _this._focusNext();
                }
            });
        }
    };
    App.prototype._focusNext = function () {
        var _this = this;
        var currInput = document.activeElement;
        if (currInput instanceof HTMLInputElement) {
            var input = currInput.nextElementSibling;
            if (currInput.ariaLabel === currInput.value) {
                if (input === null && this.totalTries <= 5) {
                    this._confetti();
                    setTimeout(function () {
                        _this.totalTries = 0;
                        randomWordsContainer === null || randomWordsContainer === void 0 ? void 0 : randomWordsContainer.classList.remove('puffInAnimation');
                        matchedWordsContainer === null || matchedWordsContainer === void 0 ? void 0 : matchedWordsContainer.classList.remove('zoomInAnimation');
                        _this._renderInitial();
                    }, 3000);
                }
                else {
                    if (input instanceof HTMLInputElement) {
                        input.focus();
                        input.placeholder = '_';
                    }
                }
            }
            else if (currInput.ariaLabel !== currInput.value) {
                currInput.classList.add('flipInY');
                this._increamentLeftTries();
                this._updateLeftTriesElement();
                this._updateDot();
                this._showMistakes(currInput.value);
                setTimeout(function () {
                    currInput.classList.remove('flipInY');
                    currInput.value = '';
                    currInput.placeholder = '_';
                }, 500);
            }
        }
    };
    App.prototype._updateDot = function () {
        if (this.totalTries <= 0 || this.totalTries >= 6)
            return;
        dots[this.totalTries - 1].classList.add('active');
    };
    App.prototype._updateLeftTriesElement = function () {
        if (triesEle instanceof HTMLParagraphElement)
            triesEle.innerHTML = "Tries(<span>".concat(this.totalTries, "</span>/5):");
    };
    App.prototype._increamentLeftTries = function () {
        this.totalTries += 1;
        if (this.totalTries > 5) {
            this.totalTries = 0;
            this._renderInitial();
            return;
        }
    };
    App.prototype._showMistakes = function (userInput) {
        if (this.totalTries <= 0 || this.totalTries >= 6)
            return;
        wrongChars[this.totalTries - 1].textContent =
            this.totalTries - 1 == 4 ? "".concat(userInput) : "".concat(userInput, ", ");
    };
    App.prototype._clearDots = function () {
        dots.forEach(function (dot) { return dot.classList.remove('active'); });
    };
    App.prototype._clearMistakesContainer = function () {
        wrongChars.forEach(function (char) { return (char.textContent = ''); });
    };
    App.prototype._confetti = function () {
        var jsConfetti = new js_confetti_1.default();
        jsConfetti.addConfetti();
    };
    return App;
}());
new App();
//# sourceMappingURL=index.js.map