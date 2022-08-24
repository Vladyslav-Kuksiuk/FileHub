package com.teamdev.services.upload;

import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.services.ApplicationProcessWithAuthorization;

import javax.annotation.Nonnull;

public abstract class FileUploadProcess extends ApplicationProcessWithAuthorization<FileUploadCommand, FileUploadResponse> {

    protected FileUploadProcess(
            @Nonnull AuthenticationDao authenticationDao) {
        super(authenticationDao);
    }
}
