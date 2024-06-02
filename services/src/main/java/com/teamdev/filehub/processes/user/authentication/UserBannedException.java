package com.teamdev.filehub.processes.user.authentication;

import com.teamdev.filehub.ServiceException;

import javax.annotation.Nonnull;

public class UserBannedException extends ServiceException {

    public UserBannedException(@Nonnull String message) {
        super(message);
    }
}
