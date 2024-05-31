package com.teamdev.filehub.views.file;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.views.View;

import java.io.InputStream;

/**
 * A {@link View} extended interface which implementation is intended to process
 * file download.
 */
public interface SharedFileDownloadView extends View<SharedFileDownloadQuery, InputStream> {

    @Override
    InputStream handle(SharedFileDownloadQuery query) throws DataNotFoundException;
}
