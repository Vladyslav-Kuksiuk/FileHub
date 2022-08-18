package com.teamdev.database;

import java.io.Serial;

public class DatabaseTransactionException extends Exception{

    @Serial
    private static final long serialVersionUID = -5450704401409114316L;

    public DatabaseTransactionException(String message) {
        super(message);
    }
}
