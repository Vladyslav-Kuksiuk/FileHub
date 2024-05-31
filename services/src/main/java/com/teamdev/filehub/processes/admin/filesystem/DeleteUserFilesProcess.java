package com.teamdev.filehub.processes.admin.filesystem;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file removing.
 */
public interface DeleteUserFilesProcess
        extends ApplicationProcess<DeleteUserFilesCommand, Boolean> {

    @Override
    Boolean handle(DeleteUserFilesCommand command) throws DataNotFoundException;
}
