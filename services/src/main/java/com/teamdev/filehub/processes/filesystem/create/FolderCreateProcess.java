package com.teamdev.filehub.processes.filesystem.create;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle folder creation.
 */
public interface FolderCreateProcess extends ApplicationProcess<FolderCreateCommand, RecordId> {

    @Override
    RecordId handle(FolderCreateCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
