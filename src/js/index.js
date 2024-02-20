'use strict';

import { generate } from 'random-words';

const randomWordsContainer = document.querySelector('.random__words__container');
const randomBtn = document.querySelector('.btn--random');
const resetBtn = document.querySelector('.btn--reset');
const matchedWordsContainer = document.querySelector('.matched__words__container');
const triesEle = document.querySelector('.tries');
const dots = document.querySelectorAll('.dot');
const wrongChars = document.querySelectorAll('.char--wrong');

class App {
  word = '';
  totalTries = 0;
  matchedCharsArray = [];

  constructor() {
    this._renderInitial();
    randomBtn.addEventListener('click', this._handleRandomBtnClick.bind(this));
    resetBtn.addEventListener('click', this._handleReset.bind(this));
  }

  _renderInitial() {
    this._generateRandomWords();
    this._generateBlankBoxes();
    this._focusNextElement();
  }

  _handleRandomBtnClick() {
    this._generateRandomWords();
    this._generateBlankBoxes();
    this._focusNextElement();
  }

  _handleReset() {
    this._renderInitial();
    this._clearDots();
  }

  _rearrangeLettersRandomly() {
    const len = this.word.length;

    let randomStr = '';
    randomStr += this.word.substring(len / 2);
    randomStr += this.word.substring(0, len / 2);
    randomStr = randomStr.split('').reverse().join('');
    return randomStr;
  }

  _generateRandomWords() {
    this.word = generate();

    if (this.word.length < 3 || this.word.length > 6) {
      while (this.word.length < 3 || this.word.length > 6) {
        this.word = generate();
      }
    }

    randomWordsContainer.innerHTML = `<span>${this._rearrangeLettersRandomly()}</span>`;
  }

  _generateBlankBoxes() {
    matchedWordsContainer.innerHTML = '';
    matchedWordsContainer.innerHTML = `
    ${this.word
      .split('')
      .map(
        (letter, i) =>
          `<input type="text" class="letter__container" maxLength="1" aria-label=${letter} required />`
      )
      .join('')}
    `;

    matchedWordsContainer.style.gridTemplateColumns = `repeat(${this.word.length}, 1fr)`;
  }

  _focusNextElement() {
    const inputs = Array.prototype.slice.call(document.querySelectorAll('input'));
    inputs.forEach((input) => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') return;
        if (input.value.length >= input.maxLength) {
          event.preventDefault();
          this._focusNext(inputs);
        }
      });
    });
  }

  _focusNext(inputs) {
    const currInput = document.activeElement;
    console.log(currInput.ariaLabel);
    const currInputIndex = inputs.indexOf(currInput);
    const nextinputIndex = (currInputIndex + 1) % inputs.length;
    const input = inputs[nextinputIndex];

    if (currInput.ariaLabel === currInput.value) {
      if (nextinputIndex == 0 && this.totalTries <= 5) {
        alert('🎉 Success');
        return;
      }

      input.focus();
      input.placeholder = '_';
    } else {
      currInput.classList.add('flipInY');
      setTimeout(() => {
        currInput.classList.remove('flipInY');
      }, 500);
      currInput.placeholder = '_';
      this._checkAnswers();
      this._showMistakes(currInput.value);
      currInput.value = '';
    }
  }

  _checkAnswers() {
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
  }

  _updateTriesElement() {
    triesEle.innerHTML = `Tries(<span>${this.totalTries}</span>/5):`;
  }

  _showMistakes(userInput) {
    if (this.totalTries - 1 == 5) return;
    wrongChars[this.totalTries - 1].textContent = `${userInput}, `;
  }

  _clearDots() {
    dots.forEach((dot) => dot.classList.remove('active'));
  }

  _clearMistakesContainer() {
    wrongChars.forEach((char) => (char.textContent = ''));
  }
}

new App();
