'use strict';

import { generate } from 'random-words';

const randomWordsContainer = document.querySelector('.random__words__container');
const randomBtn = document.querySelector('.btn--random');
const resetBtn = document.querySelector('.btn--reset');
const matchedWordsContainer = document.querySelector('.matched__words__container');
const triesEle = document.querySelector('.tries');
const dots = document.querySelectorAll('.dot');
const wrongChars = document.querySelectorAll('.char--wrong');

class Game {
  word = '';
  totalTries = 0;
  matchedCharsArray = [];

  constructor() {
    this._generateRandomWords();
    this._focusNextElement();
    randomBtn.addEventListener('click', this._generateRandomWords.bind(this));
    resetBtn.addEventListener('click', this._clear);
    matchedWordsContainer.addEventListener('input', this._validate);
  }

  _validate(e) {
    console.log(e.target.ariaLabel === e.target.value);

    return e.target.ariaLabel === e.target.value;
  }

  _generateRandomWords() {
    this.word = generate();

    if (this.word.length < 3 || this.word.length > 6) {
      while (this.word.length < 3 || this.word.length > 6) {
        this.word = generate();
      }
    }

    randomWordsContainer.textContent = this._rearrangeLettersRandomly();

    this._generateBlankBoxes();
  }

  _rearrangeLettersRandomly() {
    const len = this.word.length;

    let randomStr = '';
    randomStr += this.word.substring(len / 2);
    randomStr += this.word.substring(0, len / 2);
    randomStr = randomStr.split('').reverse().join('');
    console.log(randomStr);
    return randomStr;
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
    if (nextinputIndex == 0) return;
    if (currInput.ariaLabel === currInput.value) {
      input.focus();
      input.placeholder = '_';
    } else {
      this._checkAnswers(currInput.value);
      this._showMistakes(currInput.value);
      console.log(currInput.value);
    }
  }

  _checkAnswers() {
    this.totalTries += 1;
    if (this.totalTries > 5) {
      this.totalTries = 0;
      this._generateBlankBoxes();
      triesEle.innerHTML = `Tries(<span>${this.totalTries}</span>/5):`;
      return;
    }

    triesEle.innerHTML = `Tries(<span>${this.totalTries}</span>/5):`;
    dots[this.totalTries - 1].classList.add('active');
  }

  _showMistakes(userInput) {
    wrongChars[this.totalTries - 1].textContent = `${userInput}, `;
  }

  _clear() {
    randomWordsContainer.textContent = '';
  }
}

new Game();
