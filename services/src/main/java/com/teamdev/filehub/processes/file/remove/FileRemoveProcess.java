package com.teamdev.filehub.processes.file.remove;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.DataNotFoundException;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file removing.
 */
public interface FileRemoveProcess
        extends ApplicationProcess<FileRemoveCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FileRemoveCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
