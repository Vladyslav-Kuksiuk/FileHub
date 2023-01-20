/**
 * Folder info.
 */
export class FolderInfo {
  #name;
  #id;
  #parentId;
  #itemsAmount;

  /**
   * @param {string} name
   * @param {string} id
   * @param {string} parentId
   * @param {number} itemsAmount
   */
  constructor(name, id, parentId, itemsAmount) {
    this.#name = name;
    this.#id = id;
    this.#parentId = parentId;
    this.#itemsAmount = itemsAmount;
  }

  /**
   * @returns {string}
   */
  get name() {
    return this.#name;
  }

  /**
   * @returns {string}
   */
  get id() {
    return this.#id;
  }

  /**
   * @returns {string}
   */
  get parentId() {
    return this.#parentId;
  }

  /**
   * @returns {number}
   */
  get itemsAmount() {
    return this.#itemsAmount;
  }
}
