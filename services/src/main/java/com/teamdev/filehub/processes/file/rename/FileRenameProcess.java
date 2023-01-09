package com.teamdev.filehub.processes.file.rename;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.DataNotFoundException;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file renaming.
 */
public interface FileRenameProcess extends ApplicationProcess<FileRenameCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FileRenameCommand command)
            throws AccessDeniedException, DataNotFoundException;
}
