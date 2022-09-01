package com.teamdev.filehub.views.download;

import com.teamdev.filehub.views.View;

/**
 * A {@link View} extended interface which implementation is intended to process
 * file download.
 */
public interface FileDownloadView extends View<FileDownloadQuery, FileDownloadResponse> {

    @Override
    FileDownloadResponse handle(FileDownloadQuery query) throws FileAccessDeniedException;
}
