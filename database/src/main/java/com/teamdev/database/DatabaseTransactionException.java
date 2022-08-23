package com.teamdev.database;

import javax.annotation.Nonnull;
import java.io.Serial;

/**
 * Exception thrown if it is impossible to conduct a transaction
 * in the database.
 */
public class DatabaseTransactionException extends Exception {

    @Serial
    private static final long serialVersionUID = -5450704401409114316L;

    public DatabaseTransactionException(@Nonnull String message) {
        super(message);
    }
}
