package com.teamdev.filehub.views.file;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.View;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.folder.FileItem;

/**
 * A {@link View} extended interface which implementation is intended to process
 * user authorization.
 * Authorization converts authentication token into user id.
 */
public interface SharedFileView extends View<SharedFileQuery, FileItem> {

    @Override
    FileItem handle(SharedFileQuery query) throws DataNotFoundException;
}
