package com.teamdev.filehub.processes.logout;

import com.teamdev.filehub.processes.ProcessException;

import javax.annotation.Nonnull;

public class UserNotAuthenticatedException extends ProcessException {

    public UserNotAuthenticatedException(@Nonnull String message) {
        super(message);
    }
}
