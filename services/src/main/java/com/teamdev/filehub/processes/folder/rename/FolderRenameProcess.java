package com.teamdev.filehub.processes.folder.rename;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle folder renaming.
 */
public interface FolderRenameProcess
        extends ApplicationProcess<FolderRenameCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FolderRenameCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
