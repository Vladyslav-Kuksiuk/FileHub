package com.teamdev.server.routes;

import java.util.ArrayList;

/**
 * Data transfer object with info about all field errors.
 */
public class FieldErrors {

    private final ArrayList<FieldErrorMessage> errors = new ArrayList<>();

    public void addError(FieldErrorMessage error) {
        errors.add(error);
    }

    public ArrayList<FieldErrorMessage> getErrors() {
        return errors;
    }
}
