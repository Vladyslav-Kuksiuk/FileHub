/**
 * Service to work with titles.
 */
export class TitleService {
  #mainTitle;
  #separator;

  /**
   * @param {string} mainTitle
   * @param {string} separator
   */
  constructor(mainTitle, separator) {
    this.#mainTitle = mainTitle;
    this.#separator = separator;
  }

  /**
   * @param {[string]} titles
   */
  set titles(titles) {
    const allTitles = [this.#mainTitle, ...titles];
    document.title = allTitles.join(this.#separator);
  }
}
