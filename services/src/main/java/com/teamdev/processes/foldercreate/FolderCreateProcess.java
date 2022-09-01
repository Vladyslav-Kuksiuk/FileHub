package com.teamdev.processes.foldercreate;

import com.teamdev.persistent.dao.RecordId;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle folder creation.
 */
public interface FolderCreateProcess extends ApplicationProcess<FolderCreateCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FolderCreateCommand command) throws FolderCreateException;
}
