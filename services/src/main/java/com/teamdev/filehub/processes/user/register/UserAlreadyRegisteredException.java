package com.teamdev.filehub.processes.user.register;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;
import java.io.Serial;

/**
 * Exception thrown if there is a registered user in the system with such a login.
 */
public class UserAlreadyRegisteredException extends ServiceException {

    @Serial
    private static final long serialVersionUID = -8308138751698675799L;

    public UserAlreadyRegisteredException(@Nonnull String message) {
        super(message);
    }
}
