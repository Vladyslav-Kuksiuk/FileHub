package com.teamdev.filehub.processes.user.register;

/**
 * {@link Exception} thrown in case invalid field validation.
 * Contain name of the field, whose validation failed.
 */
public class FieldValidationException extends Exception {

    private final String field;

    public FieldValidationException(String field, String message) {
        super(message);
        this.field = field;
    }

    public String getField() {
        return field;
    }
}
