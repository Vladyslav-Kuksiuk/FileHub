package com.teamdev.server;

public class ValidationError {
    private final String fieldName;
    private final String errorText;

    public ValidationError(String field, String error) {
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
