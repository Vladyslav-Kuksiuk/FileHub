package com.teamdev.processes.upload;

import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.processes.ApplicationProcessWithAuthorization;

import javax.annotation.Nonnull;

/**
 * A {@link ApplicationProcessWithAuthorization} extended abstract class
 * which implementation is intended to process file upload.
 */
public abstract class FileUploadProcess extends ApplicationProcessWithAuthorization<FileUploadCommand, FileUploadResponse> {

    protected FileUploadProcess(
            @Nonnull AuthenticationDao authenticationDao) {
        super(authenticationDao);
    }
}
