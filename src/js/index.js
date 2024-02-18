'use strict';

import { generate } from 'random-words';

const randomWordsContainer = document.querySelector('.random__words__container');
const randomBtn = document.querySelector('.btn--random');
const resetBtn = document.querySelector('.btn--reset');
const matchedWordsContainer = document.querySelector('.matched__words__container');

class Game {
  word = '';
  matchedCharsArray = [];

  constructor() {
    this._generateRandomWords();
    randomBtn.addEventListener('click', this._generateRandomWords.bind(this));
    resetBtn.addEventListener('click', this._clear);
    matchedWordsContainer.addEventListener('input', this._checkWords.bind(this));
  }

  _checkWords(e) {
    if (e.target.value == '') return;
    else this.matchedCharsArray.push(e.target.value);
    console.log(this.matchedCharsArray);
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
        (letter) =>
          `<input type="text" class="letter__container" maxLength="1" aria-label=${letter} />`
      )
      .join('')}
    `;

    matchedWordsContainer.style.gridTemplateColumns = `repeat(${this.word.length}, 1fr)`;
  }

  _clear() {
    randomWordsContainer.textContent = '';
  }
}

new Game();
