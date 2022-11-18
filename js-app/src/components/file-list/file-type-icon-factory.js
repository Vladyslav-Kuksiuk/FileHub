/**
 * Factory for icons by file type.
 */
export class FileTypeIconFactory {
  #icons = {
    'folder': 'glyphicon-folder-close',
    'PDF Document': 'glyphicon-book',
    'Excel Workbook': 'glyphicon-list-alt',
    'JPEG Image': 'glyphicon-picture',
    'AVI Movie': 'glyphicon-film',
    'MP3 Audio': 'glyphicon-music',
  };

  /**
   * Get icon by type.
   *
   * @param {string} type
   * @returns {string}
   */
  getIcon(type) {
    return this.#icons[type] ?? 'glyphicon-file';
  }
}
