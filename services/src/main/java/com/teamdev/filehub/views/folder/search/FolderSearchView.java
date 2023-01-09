package com.teamdev.filehub.views.folder.search;

import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.DataNotFoundException;
import com.teamdev.filehub.views.View;
import com.teamdev.filehub.views.folder.FolderContent;

/**
 * {@link View} to handle {@link FolderSearchQuery}.
 */
public interface FolderSearchView extends View<FolderSearchQuery, FolderContent> {

    @Override
    FolderContent handle(FolderSearchQuery query)
            throws AccessDeniedException, DataNotFoundException;
}
