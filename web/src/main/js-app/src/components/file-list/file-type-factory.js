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
    'image/bmp': {
      type: 'BMP Image',
      icon: 'glyphicon-picture',
    },
    'image/png': {
      type: 'PNG Image',
      icon: 'glyphicon-picture',
    },
    'video/avi': {
      type: 'AVI Movie',
      icon: 'glyphicon-film',
    },
    'video/mp4': {
      type: 'MP4 Movie',
      icon: 'glyphicon-film',
    },
    'video/x-matroska': {
      type: 'MKV Movie',
      icon: 'glyphicon-film',
    },
    'audio/mpeg': {
      type: 'MP3 Audio',
      icon: 'glyphicon-music',
    },
    'audio/wav': {
      type: 'WAV Audio',
      icon: 'glyphicon-music',
    },
    'text/plain': {
      type: 'TXT Text',
      icon: 'glyphicon-book',
    },
    'application/vnd.ms-excel': {
      type: 'Excel Workbook',
      icon: 'glyphicon-list-alt',
    },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': {
      type: 'Excel Workbook',
      icon: 'glyphicon-list-alt',
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
