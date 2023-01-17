package com.teamdev.filehub.views.folder.content;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.views.View;

/**
 * {@link View} to handle {@link FolderContentQuery}.
 */
public interface FolderContentView extends View<FolderContentQuery, FolderContent> {

    @Override
    FolderContent handle(FolderContentQuery query)
            throws AccessDeniedException, DataNotFoundException;
}
