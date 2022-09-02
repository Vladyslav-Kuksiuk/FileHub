package com.teamdev.filehub.processes.authentication;

import com.teamdev.filehub.processes.ProcessException;

import javax.annotation.Nonnull;

public class UserDataMismatchException extends ProcessException {

    public UserDataMismatchException(@Nonnull String message) {
        super(message);
    }
}
