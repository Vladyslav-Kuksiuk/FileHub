package com.teamdev.views.download;

import com.teamdev.views.View;

/**
 * A {@link View} extended interface which implementation is intended to process
 * file download.
 */
public interface FileDownloadView extends View<FileDownloadQuery, FileDownloadResponse> {

    @Override
    FileDownloadResponse handle(FileDownloadQuery query) throws FileAccessDeniedException;
}
