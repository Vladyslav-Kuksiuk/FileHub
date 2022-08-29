package com.teamdev.processes.authentication;

import com.teamdev.processes.ProcessException;

import javax.annotation.Nonnull;

public class UserDataMismatchException extends ProcessException {

    public UserDataMismatchException(@Nonnull String message) {
        super(message);
    }
}
