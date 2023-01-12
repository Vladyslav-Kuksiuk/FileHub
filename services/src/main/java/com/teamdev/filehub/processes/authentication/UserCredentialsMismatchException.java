package com.teamdev.filehub.processes.authentication;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class UserCredentialsMismatchException extends ServiceException {

    public UserCredentialsMismatchException(@Nonnull String message) {
        super(message);
    }
}
