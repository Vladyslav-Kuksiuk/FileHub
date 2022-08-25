package com.teamdev.database;

import javax.annotation.Nonnull;
import java.io.Serial;

/**
 * Exception thrown if the database cannot be updated.
 */
public class DatabaseException extends Exception {

    @Serial
    private static final long serialVersionUID = -600675094186265865L;

    public DatabaseException(@Nonnull String message) {
        super(message);
    }

    public DatabaseException(@Nonnull String message, @Nonnull Throwable cause) {
        super(message, cause);
    }
}
