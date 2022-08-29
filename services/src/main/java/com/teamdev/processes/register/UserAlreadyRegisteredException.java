package com.teamdev.processes.register;

import com.teamdev.processes.ProcessException;

import javax.annotation.Nonnull;

public class UserAlreadyRegisteredException extends ProcessException {

    public UserAlreadyRegisteredException(@Nonnull String message) {
        super(message);
    }
}
