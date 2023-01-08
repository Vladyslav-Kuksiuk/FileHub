package com.teamdev.filehub.views;

import javax.annotation.Nonnull;

/**
 * An exception is thrown when queried data not found.
 */
public class DataNotFoundException extends ViewException {

    public DataNotFoundException(@Nonnull String message) {
        super(message);
    }
}
