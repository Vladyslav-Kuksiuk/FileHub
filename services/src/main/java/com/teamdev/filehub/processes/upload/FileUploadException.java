package com.teamdev.filehub.processes.upload;

import com.teamdev.filehub.processes.ProcessException;

import javax.annotation.Nonnull;

public class FileUploadException extends ProcessException {

    public FileUploadException(@Nonnull String message) {
        super(message);
    }
}
