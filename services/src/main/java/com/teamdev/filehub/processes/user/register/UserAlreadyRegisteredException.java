package com.teamdev.filehub.processes.user.register;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

/**
 * Exception thrown if there is a registered user in the system with such a login.
 */
public class UserAlreadyRegisteredException extends ServiceException {

    public UserAlreadyRegisteredException(@Nonnull String message) {
        super(message);
    }
}
