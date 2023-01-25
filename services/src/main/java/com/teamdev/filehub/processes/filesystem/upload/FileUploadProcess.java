package com.teamdev.filehub.processes.filesystem.upload;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file upload.
 */
public interface FileUploadProcess extends ApplicationProcess<FileUploadCommand, RecordId> {

    @Override
    RecordId handle(FileUploadCommand command) throws AccessDeniedException,
                                                      DataNotFoundException;
}
