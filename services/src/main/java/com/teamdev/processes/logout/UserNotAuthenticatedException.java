package com.teamdev.processes.logout;

import com.teamdev.processes.ProcessException;

import javax.annotation.Nonnull;

public class UserNotAuthenticatedException extends ProcessException {

    public UserNotAuthenticatedException(@Nonnull String message) {
        super(message);
    }
}
