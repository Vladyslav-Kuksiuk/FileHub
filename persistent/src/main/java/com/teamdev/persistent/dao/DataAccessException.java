package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;
import java.io.Serial;

/**
 * Exception thrown if it is impossible to conduct a transaction with the database.
 */
public class DataAccessException extends Exception {

    @Serial
    private static final long serialVersionUID = 8905325487892940162L;

    public DataAccessException(@NotNull String message) {
        super(message);
    }

    public DataAccessException(@NotNull String message, @NotNull Throwable cause) {
        super(message, cause);
    }
}
