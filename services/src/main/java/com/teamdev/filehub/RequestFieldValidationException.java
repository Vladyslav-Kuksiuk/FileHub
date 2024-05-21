package com.teamdev.filehub;

/**
 * {@link ServiceException} thrown in case invalid request field validation.
 * Contain name of the field, whose validation failed.
 */
public class RequestFieldValidationException extends ServiceException {

    private final String field;

    public RequestFieldValidationException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
