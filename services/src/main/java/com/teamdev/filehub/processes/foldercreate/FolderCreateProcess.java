package com.teamdev.filehub.processes.foldercreate;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle folder creation.
 */
public interface FolderCreateProcess extends ApplicationProcess<FolderCreateCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FolderCreateCommand command) throws AccessDeniedException;
}
