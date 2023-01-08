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
  parentId;

  /**
   * @type {string}
   */
  name;

  /**
   * @type {number}
   */
  size;

  /**
   * @type {string}
   */
  mimetype;

  /**
   * @type {number}
   */
  itemsAmount;

  /**
   * @typedef FileModel
   * @property {string} type
   * @property {string} id
   * @property {string} parentId
   * @property {string} name
   * @property {string} mimetype
   * @property {number} size
   */

  /**
   * @typedef FolderModel
   * @property {string} type
   * @property {string} id
   * @property {string} parentId
   * @property {string} name
   * @property {number} itemsAmount
   */

  /**
   *
   * @param {FileModel | FolderModel} properties
   */
  constructor(properties) {
    this.type = properties.type;
    this.id = properties.id;
    this.parentId = properties.parentId;
    this.name = properties.name;
    this.size = properties.size;
    this.mimetype = properties.mimetype;
    this.itemsAmount = properties.itemsAmount;
    Object.freeze(this);
  }
}
