package com.teamdev.filehub.processes.filesystem.remove;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file removing.
 */
public interface RemoveProcess
        extends ApplicationProcess<RemoveCommand, RecordId> {

    @Override
    RecordId handle(RemoveCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
