package com.teamdev.filehub.processes.filesystem.share;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.views.folder.FileItem;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file sharing.
 */
public interface ChangeFileShareStatusProcess extends ApplicationProcess<ChangeFileShareStatusCommand, FileItem> {

    @Override
    FileItem handle(ChangeFileShareStatusCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
