package com.teamdev.filehub;

import java.io.Serial;

/**
 * {@link ServiceException} thrown in case invalid request field validation.
 * Contain name of the field, whose validation failed.
 */
public class RequestFieldValidationException extends ServiceException {

    @Serial
    private static final long serialVersionUID = 3586942189792782681L;

    private final String field;

    public RequestFieldValidationException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
