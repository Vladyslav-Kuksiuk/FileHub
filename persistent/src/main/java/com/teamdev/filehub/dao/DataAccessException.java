package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;
import java.io.Serial;

/**
 * Exception thrown if it is impossible to conduct a transaction with the database.
 */
public class DataAccessException extends Exception {

    @Serial
    private static final long serialVersionUID = 8905325487892940162L;

    public DataAccessException(@Nonnull String message) {
        super(message);
    }

    public DataAccessException(@Nonnull String message, @Nonnull Throwable cause) {
        super(message, cause);
    }
}
