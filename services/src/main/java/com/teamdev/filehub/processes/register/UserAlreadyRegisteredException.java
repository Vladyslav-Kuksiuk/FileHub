package com.teamdev.filehub.processes.register;

import com.teamdev.filehub.processes.ProcessException;

import javax.annotation.Nonnull;

/**
 * Exception thrown if there is a registered user in the system with such a login.
 */
public class UserAlreadyRegisteredException extends ProcessException {

    public UserAlreadyRegisteredException(@Nonnull String message) {
        super(message);
    }
}
