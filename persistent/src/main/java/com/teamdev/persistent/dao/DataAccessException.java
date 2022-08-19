package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;

public class DataAccessException extends Exception {

    public DataAccessException(@NotNull String message) {
        super(message);
    }

    public DataAccessException(@NotNull String message, @NotNull Throwable cause) {
        super(message, cause);
    }
}
