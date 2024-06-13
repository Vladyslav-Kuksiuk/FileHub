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
   * @type {string}
   */
  parentId;

  /**
   * @param {string} type
   * @param {string} id
   * @param {string} name
   * @param {string} size
   * @param {string} parentId
   */
  constructor(type, id, name, size, parentId) {
    this.type = type;
    this.id = id;
    this.name = name;
    this.size = size;
    this.parentId = parentId;
    Object.freeze(this);
  }
}
