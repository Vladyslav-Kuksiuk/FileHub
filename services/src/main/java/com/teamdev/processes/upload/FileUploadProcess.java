package com.teamdev.processes.upload;

import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file upload.
 */
public interface FileUploadProcess extends ApplicationProcess<FileUploadCommand, Boolean> {

    @Override
    Boolean handle(FileUploadCommand command) throws FileAlreadyExistsException;
}
