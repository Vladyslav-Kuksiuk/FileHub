package com.teamdev.filehub.processes;

import javax.annotation.Nonnull;

/**
 * An exception is thrown when data not found.
 */
public class DataNotFoundException extends ProcessException {

    public DataNotFoundException(@Nonnull String message) {
        super(message);
    }
}
