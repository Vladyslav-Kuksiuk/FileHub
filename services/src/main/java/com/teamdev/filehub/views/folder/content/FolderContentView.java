package com.teamdev.filehub.views.folder.content;

import com.teamdev.filehub.views.AccessDeniedException;
import com.teamdev.filehub.views.DataNotFoundException;
import com.teamdev.filehub.views.View;
import com.teamdev.filehub.views.folder.FolderContent;

public interface FolderContentView extends View<FolderContentQuery, FolderContent> {

    @Override
    FolderContent handle(FolderContentQuery query)
            throws AccessDeniedException, DataNotFoundException;
}
