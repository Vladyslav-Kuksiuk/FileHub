import {Component} from '../component';

/**
 * UserInfo component.
 */
export class UserInfo extends Component {
  #hasError;
  #username;
  #isLoading;

  /**
   * @param {HTMLElement} parent
   * @param {boolean} isLoading
   * @param {string} username
   * @param {boolean} hasError
   */
  constructor(parent, isLoading, username, hasError) {
    super(parent);

    this.#isLoading = isLoading;
    this.#hasError = hasError;
    this.#username = username;
    this.init();
  }

  /**
   * @param {string} username
   * @private
   */
  set username(username) {
    this.#username = username;
    this.render();
  }

  /**
   * @param {boolean} hasError
   * @private
   */
  set hasError(hasError) {
    this.#hasError = hasError;
    this.render();
  }

  /**
   * @param {boolean} isLoading
   * @private
   */
  set isLoading(isLoading) {
    this.#isLoading = isLoading;
    this.render();
  }

  /**
   * @inheritDoc
   */
  markup() {
    if (this.#isLoading) {
      return `<span ${this.markElement('user-info-loading')}
                     aria-hidden="true" class="glyphicon glyphicon-repeat"></span>`;
    }

    if (this.#hasError) {
      return `
            <span ${this.markElement('user-info-error')} class="text-danger"> 
                    <span class="glyphicon glyphicon-exclamation-sign"></span>
                    Can't load user data
            </span>`;
    }

    return `
      <slot>
          <span aria-hidden="true" class="glyphicon glyphicon-user"></span>
          <span ${this.markElement('user-info-username')}>${this.#username}</span>
      </slot>
      `;
  }
}
