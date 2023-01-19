package com.teamdev.filehub.processes.upload;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class FileUploadException extends ServiceException {

    public FileUploadException(@Nonnull String message) {
        super(message);
    }
}
