package com.teamdev.filehub.processes.folder.remove;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.DataNotFoundException;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle folder removing.
 */
public interface FolderRemoveProcess
        extends ApplicationProcess<FolderRemoveCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FolderRemoveCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
