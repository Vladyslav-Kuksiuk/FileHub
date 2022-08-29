package com.teamdev.processes.upload;

import com.teamdev.processes.ApplicationProcess;

/**
 * A {@link ApplicationProcess} extended abstract class
 * which implementation is intended to process file upload.
 */
public interface FileUploadProcess extends ApplicationProcess<FileUploadCommand, Boolean> {

}
