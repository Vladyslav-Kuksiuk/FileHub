package com.teamdev.filehub.processes.folder.rename;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.DataNotFoundException;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle folder renaming.
 */
public interface FolderRenameProcess
        extends ApplicationProcess<FolderRenameCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FolderRenameCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
