package com.teamdev.filehub.views.download;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.views.View;

import java.io.InputStream;

/**
 * A {@link View} extended interface which implementation is intended to process
 * file download.
 */
public interface FileDownloadView extends View<FileDownloadQuery, InputStream> {

    @Override
    InputStream handle(FileDownloadQuery query) throws AccessDeniedException, DataNotFoundException;
}
