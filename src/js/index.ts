import { generate } from 'random-words';
import JSConfetti from 'js-confetti';

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
    this._focusNextElement();
    if (randomBtn instanceof HTMLButtonElement && resetBtn instanceof HTMLButtonElement) {
      randomBtn.addEventListener('click', this._handleRandomBtnClick.bind(this));
      resetBtn.addEventListener('click', this._handleReset.bind(this));
    }
  }

  /**
   * This method initially generates random word, creates blank boxes,
   * update left tries element value to 0, clears dot container,
   * clears mistake container, toggle animations, and focuses first
   * input element
   * @protected
   */
  _renderInitial(): void {
    this._generateRandomWords();
    this._createBlankBoxes();
    this._updateLeftTriesElement();
    this._clearDots();
    this._clearMistakesContainer();
    this._toggleAnimation();
    this._focusFirstElement();
  }

  /**
   * The method handles the event triggered by the random button.
   * @protected
   */
  _handleRandomBtnClick(): void {
    this._generateRandomWords();
    this._createBlankBoxes();
    this._focusFirstElement();
    this._toggleAnimation();
  }

  /**
   * The method handles the event triggered by the reset button and
   * under the hood calls renderInitial() to clear the UI.
   * @protected
   */
  _handleReset(): void {
    this.totalTries = 0;
    this._renderInitial();
  }

  /**
   * The method focus on the first input element after 1.7 secs.
   * @protected
   */
  _focusFirstElement() {
    setTimeout(() => {
      const firstInputElement = matchedWordsContainer?.children[0];
      if (firstInputElement instanceof HTMLInputElement) firstInputElement.focus();
    }, 1700);
  }

  /**
   * The method adds animation to the randomWordsContainer and matchedWordsContainer
   * and removes after 1.8sec.
   * @protected
   */
  _toggleAnimation() {
    randomWordsContainer?.classList.add('puffInAnimation');
    matchedWordsContainer?.classList.add('zoomInAnimation');

    setTimeout(() => {
      randomWordsContainer?.classList.remove('puffInAnimation');
      matchedWordsContainer?.classList.remove('zoomInAnimation');
    }, 1800);
  }

  /**
   * The method creates randomly arranged word.
   * @returns {string} - A randomly generated string
   * @protected
   */
  _rearrangeLettersRandomly(): string {
    const len = this.word.length;

    let randomStr: string = '';
    if (typeof this.word === 'string') {
      randomStr = this.word.substring(len / 2) + this.word.substring(0, len / 2);
      randomStr = randomStr.split('').reverse().join('');
    }
    return randomStr;
  }

  /**
   * The method uses generate() of random-words library to generate
   * a random word of length in between 3 and 6
   * @protected
   */
  _generateRandomWords(): void {
    if (typeof this.word === 'string') this.word = generate();

    if (this.word.length < 3 || this.word.length > 6) {
      while (this.word.length < 3 || this.word.length > 6) {
        this.word = generate();
      }
    }

    this._addMarkup();
  }

  /**
   * The method appends the span element inside the randomWordsContainer element.
   * @protected
   */
  _addMarkup() {
    if (randomWordsContainer instanceof HTMLParagraphElement)
      randomWordsContainer.innerHTML = `<span>${this._rearrangeLettersRandomly()}</span>`;
  }

  /**
   * The method creates dynamicaaly blank boxes input element
   * relative to the randomly generated word length.
   * @protected
   */
  _createBlankBoxes(): void {
    if (typeof this.word === 'string' && matchedWordsContainer instanceof HTMLFormElement) {
      matchedWordsContainer.innerHTML = '';
      matchedWordsContainer.innerHTML = `
  
    ${this.word
      .split('')
      .map(
        letter =>
          `<input type="text" class="letter__container" maxLength="1" aria-label=${letter} required />`
      )
      .join('')}
    `;
    }

    if (matchedWordsContainer instanceof HTMLFormElement)
      matchedWordsContainer.style.gridTemplateColumns = `repeat(${this.word.length}, 1fr)`;
  }

  /**
   * The method adds the callback to the form element for the input event
   * and if the length of the current input is one, focusNext() is being called.
   * @protected
   */
  _focusNextElement(): void {
    if (matchedWordsContainer instanceof HTMLFormElement) {
      matchedWordsContainer.addEventListener('input', event => {
        if (
          event.target instanceof HTMLInputElement &&
          event.target.value.length === event.target.maxLength
        ) {
          this._focusNext();
        }
      });
    }
  }

  /**
   * The method checks if the current active element's value is correct
   * and the next element is empty then confetti is generated making the UI
   * back to empty state or else next element is focused. And, if the current
   * active element's value is incorrect then adds flip animation, updates the total tries
   * left, and the wrong character.
   * @protected
   */
  _focusNext(): void {
    const currInput = document.activeElement;
    if (currInput instanceof HTMLInputElement) {
      const input = currInput.nextElementSibling;

      if (currInput.ariaLabel?.toLocaleLowerCase() === currInput.value.toLocaleLowerCase()) {
        if (input === null && this.totalTries <= 5) {
          this._confetti();
          setTimeout(() => {
            this.totalTries = 0;
            this._renderInitial();
          }, 3000);
        } else {
          if (input instanceof HTMLInputElement) {
            input.focus();
            input.placeholder = '_';
          }
        }
      } else if (currInput.ariaLabel?.toLocaleLowerCase() !== currInput.value.toLocaleUpperCase()) {
        currInput.classList.add('flipInY');
        this._increamentLeftTries();
        this._updateLeftTriesElement();
        this._updateDot();
        this._showMistakes(currInput.value);
        setTimeout(() => {
          currInput.classList.remove('flipInY');
          currInput.value = '';
          currInput.placeholder = '_';
        }, 500);
      }
    }
  }

  /**
   * The method makes the dot element active.
   * @protected
   */
  _updateDot(): void {
    if (this.totalTries <= 0 || this.totalTries >= 6) return;

    dots[this.totalTries - 1].classList.add('active');
  }

  /**
   * The method appends the span element with value equivalent
   * to the number of tries left.
   * @protected
   */
  _updateLeftTriesElement() {
    if (triesEle instanceof HTMLParagraphElement)
      triesEle.innerHTML = `Tries(<span>${this.totalTries}</span>/5):`;
  }

  /**
   * The method increments the total tries value and
   * if the total tries exceeds 5 then the UI is cleared and
   * initial styles are applies.
   * @protected
   */
  _increamentLeftTries(): void {
    this.totalTries += 1;
    if (this.totalTries > 5) {
      this.totalTries = 0;
      this._renderInitial();
      return;
    }
  }

  /**
   * The method appends the incorrect character entered by the user to the
   * wrongChars element.
   * @param {string} userInput - The input element value entered by the user.
   * @protected
   */
  _showMistakes(userInput: string): void {
    if (this.totalTries <= 0 || this.totalTries >= 6) return;

    wrongChars[this.totalTries - 1].textContent =
      this.totalTries - 1 == 4 ? `${userInput}` : `${userInput}, `;
  }

  /**
   * The method clears all the active dots element back to the normal state
   * @protected
   */
  _clearDots(): void {
    dots.forEach(dot => dot.classList.remove('active'));
  }

  /**
   * The method clears the mistake container and makes it back to the empty state.
   * @protected
   */
  _clearMistakesContainer(): void {
    wrongChars.forEach(char => (char.textContent = ''));
  }

  /**
   * The method uses JSConfetti library to generate the confetti animation.
   * @protected
   */
  _confetti(): void {
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti();
  }
}

new App();
