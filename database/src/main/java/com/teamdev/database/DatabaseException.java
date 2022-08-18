package com.teamdev.database;

import javax.validation.constraints.NotNull;
import java.io.Serial;

public class DatabaseException extends Exception{

    @Serial
    private static final long serialVersionUID = -600675094186265865L;

    public DatabaseException(@NotNull String message) {
        super(message);
    }

    public DatabaseException(@NotNull String message, @NotNull Throwable cause) {
        super(message, cause);
    }
}
