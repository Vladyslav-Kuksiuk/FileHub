package com.teamdev.filehub.processes.renamefile;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.DataNotFoundException;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file renaming.
 */
public interface RenameFileProcess extends ApplicationProcess<RenameFileCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(RenameFileCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
