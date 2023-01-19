package com.teamdev.filehub.views.folder.info;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.views.View;

/**
 * {@link View} to handle {@link FolderInfoQuery}.
 */
public interface FolderInfoView extends View<FolderInfoQuery, FolderInfo> {

    @Override
    FolderInfo handle(FolderInfoQuery query) throws AccessDeniedException, DataNotFoundException;
}
