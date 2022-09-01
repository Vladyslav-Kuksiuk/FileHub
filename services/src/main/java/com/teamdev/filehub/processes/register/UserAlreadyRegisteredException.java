package com.teamdev.filehub.processes.register;

import com.teamdev.filehub.processes.ProcessException;

import javax.annotation.Nonnull;

public class UserAlreadyRegisteredException extends ProcessException {

    public UserAlreadyRegisteredException(@Nonnull String message) {
        super(message);
    }
}
