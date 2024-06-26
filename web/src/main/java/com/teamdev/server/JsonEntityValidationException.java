package com.teamdev.server;

import java.io.Serial;

/**
 * The {@link Exception} that is thrown if the JSON object is invalid.
 */
public class JsonEntityValidationException extends Exception {

    @Serial
    private static final long serialVersionUID = 8996334463563308701L;

    public JsonEntityValidationException(String message) {
        super(message);
    }
}
