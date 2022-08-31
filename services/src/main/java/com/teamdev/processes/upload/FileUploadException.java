package com.teamdev.processes.upload;

import com.teamdev.processes.ProcessException;

import javax.annotation.Nonnull;

public class FileUploadException extends ProcessException {

    public FileUploadException(@Nonnull String message) {
        super(message);
    }
}
