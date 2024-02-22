import { generate } from 'random-words';

const randomWordsContainer = document.querySelector('.random__words__container');
const randomBtn = document.querySelector('.btn--random');
const resetBtn = document.querySelector('.btn--reset');
const matchedWordsContainer = document.querySelector('.matched__words__container');
const triesEle = document.querySelector('.tries');
const dots = document.querySelectorAll('.dot');
const wrongChars = document.querySelectorAll('.char--wrong');

class App {
  word: string | string[] = '';
  totalTries = 0;

  constructor() {
    this._renderInitial();
    if (randomBtn instanceof HTMLButtonElement && resetBtn instanceof HTMLButtonElement) {
      randomBtn.addEventListener('click', this._handleRandomBtnClick.bind(this));
      resetBtn.addEventListener('click', this._handleReset.bind(this));
    }
  }

  _renderInitial(): void {
    this._generateRandomWords();
    this._generateBlankBoxes();
    this._focusNextElement();
  }

  _handleRandomBtnClick(): void {
    this._generateRandomWords();
    this._generateBlankBoxes();
    this._focusNextElement();
  }

  _handleReset(): void {
    this._renderInitial();
    this._clearDots();
  }

  _rearrangeLettersRandomly(): string {
    const len = this.word.length;

    let randomStr: string = '';
    if (typeof this.word === 'string') {
      randomStr += this.word.substring(len / 2);
      randomStr += this.word.substring(0, len / 2);
      randomStr = randomStr.split('').reverse().join('');
    }
    return randomStr;
  }

  _generateRandomWords(): void {
    if (typeof this.word === 'string') this.word = generate();

    if (this.word.length < 3 || this.word.length > 6) {
      while (this.word.length < 3 || this.word.length > 6) {
        this.word = generate();
      }
    }

    if (randomWordsContainer instanceof HTMLParagraphElement)
      randomWordsContainer.innerHTML = `<span>${this._rearrangeLettersRandomly()}</span>`;
  }

  _generateBlankBoxes(): void {
    if (typeof this.word === 'string' && matchedWordsContainer instanceof HTMLFormElement) {
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
    }

    if (matchedWordsContainer instanceof HTMLFormElement)
      matchedWordsContainer.style.gridTemplateColumns = `repeat(${this.word.length}, 1fr)`;
  }

  _focusNextElement(): void {
    const inputs: HTMLInputElement[] = Array.prototype.slice.call(
      document.querySelectorAll('input')
    );

    inputs.forEach((input: HTMLInputElement) => {
      input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace') return;
        if (input.value.length >= input.maxLength) {
          event.preventDefault();
          this._focusNext(inputs);
        }
      });
    });
  }

  _focusNext(inputs: HTMLInputElement[]) {
    const currInput = document.activeElement;
    if (currInput instanceof HTMLInputElement) {
      const currInputIndex: number = inputs.indexOf(currInput);
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
  }

  _checkAnswers(): void {
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

  _updateTriesElement(): void {
    if (triesEle instanceof HTMLParagraphElement)
      triesEle.innerHTML = `Tries(<span>${this.totalTries}</span>/5):`;
  }

  _showMistakes(userInput: string): void {
    if (this.totalTries - 1 == 5) return;
    wrongChars[this.totalTries - 1].textContent = `${userInput}, `;
  }

  _clearDots(): void {
    dots.forEach((dot) => dot.classList.remove('active'));
  }

  _clearMistakesContainer(): void {
    wrongChars.forEach((char) => (char.textContent = ''));
  }
}

new App();
