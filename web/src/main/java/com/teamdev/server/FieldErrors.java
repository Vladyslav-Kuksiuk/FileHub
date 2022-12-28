package com.teamdev.server;

import java.util.ArrayList;

/**
 * Data transfer object with info about all field errors.
 */
public class FieldErrors {
    private final ArrayList<FieldError> errors = new ArrayList<>();

    public void addError(FieldError error) {
        errors.add(error);
    }

    public ArrayList<FieldError> getErrors() {
        return errors;
    }
}
