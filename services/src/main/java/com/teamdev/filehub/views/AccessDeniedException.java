package com.teamdev.filehub.views;

import javax.annotation.Nonnull;

/**
 * An exception is thrown when access is denied.
 */
public class AccessDeniedException extends ViewException {

    public AccessDeniedException(@Nonnull String message) {
        super(message);
    }
}
