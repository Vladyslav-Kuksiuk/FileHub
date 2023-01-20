package com.teamdev.filehub.processes.filesystem.rename;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle renaming.
 */
public interface RenameProcess
        extends ApplicationProcess<RenameCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(RenameCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
