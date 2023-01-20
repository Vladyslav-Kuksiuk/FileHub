package com.teamdev.filehub.processes.user.authentication;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class UserCredentialsMismatchException extends ServiceException {

    public UserCredentialsMismatchException(@Nonnull String message) {
        super(message);
    }
}
