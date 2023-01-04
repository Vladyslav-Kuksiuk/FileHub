package com.teamdev.filehub.views.authorization;

import com.teamdev.filehub.views.ViewException;

import javax.annotation.Nonnull;

/**
 * Exception thrown in case of user authorization failed.
 */
public class UnauthorizedUserException extends ViewException {

    public UnauthorizedUserException(@Nonnull String message) {
        super(message);
    }
}
