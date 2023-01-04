package com.teamdev.server;

/**
 * Data transfer object with info about some field error.
 */
public class FieldErrorMessage {
    private final String fieldName;
    private final String errorText;

    public FieldErrorMessage(String field, String error) {
        this.fieldName = field;
        this.errorText = error;
    }

    public String getFieldName() {
        return fieldName;
    }

    public String getError() {
        return errorText;
    }
}
