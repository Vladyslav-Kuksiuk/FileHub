package com.teamdev.processes.upload;

import com.teamdev.processes.ProcessException;

import javax.annotation.Nonnull;

public class FileAlreadyExistsException extends ProcessException {

    public FileAlreadyExistsException(@Nonnull String message) {
        super(message);
    }
}
