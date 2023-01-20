package com.teamdev.filehub.views.folder.search;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.views.View;
import com.teamdev.filehub.views.folder.FolderContent;

import javax.annotation.Nonnull;

/**
 * {@link View} to handle {@link FolderSearchQuery}.
 */
public interface FolderSearchView extends View<FolderSearchQuery, FolderContent> {

    @Override
    FolderContent handle(@Nonnull FolderSearchQuery query)
            throws AccessDeniedException, DataNotFoundException;
}
