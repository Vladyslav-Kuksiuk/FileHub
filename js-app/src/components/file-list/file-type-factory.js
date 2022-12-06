/**
 * Factory for icons by file type.
 */
export class FileTypeFactory {
  #mimetypes = {
    'application/pdf': {
      type: 'PDF Document',
      icon: 'glyphicon-book',
    },
    'image/jpeg': {
      type: 'JPEG Image',
      icon: 'glyphicon-picture',
    },
    'video/x-msvideo': {
      type: 'AVI Movie',
      icon: 'glyphicon-film',
    },
    'audio/mp3': {
      type: 'MP3 Audio',
      icon: 'glyphicon-music',
    },
  };

  /**
   * @typedef Type
   * @property {string} icon
   * @property {string} type
   */

  /**
   * Get icon by type.
   *
   * @param {string} mimetype
   * @returns {Type}
   */
  getType(mimetype) {
    return this.#mimetypes[mimetype] ?? {
      icon: 'glyphicon-file',
      type: mimetype,
    };
  }
}
