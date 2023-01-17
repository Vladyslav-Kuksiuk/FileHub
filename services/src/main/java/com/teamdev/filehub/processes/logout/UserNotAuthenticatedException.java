package com.teamdev.filehub.processes.logout;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;
import java.io.Serial;

public class UserNotAuthenticatedException extends ServiceException {

    @Serial
    private static final long serialVersionUID = 8237543588788282733L;

    public UserNotAuthenticatedException(@Nonnull String message) {
        super(message);
    }
}
