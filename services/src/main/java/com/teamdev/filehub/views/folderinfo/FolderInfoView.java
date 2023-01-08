package com.teamdev.filehub.views.folderinfo;

import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.DataNotFoundException;
import com.teamdev.filehub.views.View;

/**
 * {@link View} to handle {@link FolderInfoQuery}.
 */
public interface FolderInfoView extends View<FolderInfoQuery, FolderInfo> {

    @Override
    FolderInfo handle(FolderInfoQuery query) throws AccessDeniedException, DataNotFoundException;
}
