package com.teamdev.filehub.processes.file.upload;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file upload.
 */
public interface FileUploadProcess extends ApplicationProcess<FileUploadCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FileUploadCommand command) throws AccessDeniedException;
}
