package com.teamdev.processes.upload;

import com.teamdev.persistent.dao.RecordId;
import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} which implementation is intended to handle file upload.
 */
public interface FileUploadProcess extends ApplicationProcess<FileUploadCommand, RecordId<String>> {

    @Override
    RecordId<String> handle(FileUploadCommand command) throws FileUploadException;
}
