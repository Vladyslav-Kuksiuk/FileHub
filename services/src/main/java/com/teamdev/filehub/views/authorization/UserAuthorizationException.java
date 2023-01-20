package com.teamdev.filehub.views.authorization;

import com.teamdev.filehub.ServiceException;

/**
 * An {@link ServiceException} thrown if the user authorization failed.
 */
public class UserAuthorizationException extends ServiceException {

    public UserAuthorizationException(String message) {
        super(message);
    }
}
