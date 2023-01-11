package com.teamdev.filehub.processes.authentication;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class UserDataMismatchException extends ServiceException {

    public UserDataMismatchException(@Nonnull String message) {
        super(message);
    }
}
