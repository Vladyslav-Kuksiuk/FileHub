package com.teamdev.server;

import java.util.ArrayList;

public class ValidationErrors {
    private final ArrayList<ValidationError> errors = new ArrayList<>();

    public void addError(ValidationError error) {
        errors.add(error);
    }

    public ArrayList<ValidationError> getErrors() {
        return errors;
    }
}
