package com.teamdev.filehub.processes.user.authentication;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class UserEmailNotConfirmedException extends ServiceException {

    public UserEmailNotConfirmedException(@Nonnull String message) {
        super(message);
    }
}
