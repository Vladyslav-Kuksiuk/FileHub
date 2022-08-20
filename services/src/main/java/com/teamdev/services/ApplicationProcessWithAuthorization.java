package com.teamdev.services;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.user.AuthenticationRecord;
import com.teamdev.persistent.dao.user.UserDao;

import java.util.Date;

public abstract class ApplicationProcessWithAuthorization
        <C extends CommandWithAuthorizationData, R extends ServerResponse>
        implements ApplicationProcess<C, R> {

    private final long TOKEN_EXPIRATION_TIME = 24 * 60 * 60; //24 hours in seconds
    private final UserDao userDao;

    protected ApplicationProcessWithAuthorization(UserDao userDao) {
        this.userDao = Preconditions.checkNotNull(userDao);
    }

    protected void authorize(C command) throws DataAccessException {
        AuthenticationRecord authenticationRecord = userDao.findAuthentication(command.userId());

        if (!authenticationRecord.authenticationToken()
                                 .equals(command.authenticationToken()) ||
            authenticationRecord.authorizationTime()
                                .getTime() > new Date().getTime() + TOKEN_EXPIRATION_TIME) {
            throw new DataAccessException("Authentication token verification failed.");
        }

    }

}
