/**
 * Folder content item.
 */
export class FolderContentItem {
  /**
   * @type {string}
   */
  type;

  /**
   * @type {string}
   */
  id;

  /**
   * @type {string}
   */
  name;

  /**
   * @type {string}
   */
  size;

  /**
   * @param {string} type
   * @param {string} id
   * @param {string} name
   * @param {string} size
   */
  constructor(type, id, name, size) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.size = size;
    Object.freeze(this);
  }
}
