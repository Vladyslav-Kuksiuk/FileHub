package com.teamdev.services;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import com.teamdev.util.LocalDateTimeUtil;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

public abstract class ApplicationProcessWithAuthorization
        <C extends CommandWithAuthorizationData, R extends ServerResponse>
        implements ApplicationProcess<C, R> {

    private final AuthenticationDao authenticationDao;

    protected ApplicationProcessWithAuthorization(@NotNull AuthenticationDao authenticationDao) {
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
    }

    protected void authorize(@NotNull C command) throws DataAccessException {
        AuthenticationRecord authenticationRecord = authenticationDao.find(command.userId());

        if (!authenticationRecord.authenticationToken()
                                 .equals(command.authenticationToken()) ||
                authenticationRecord.expireTime()
                                    .isAfter(LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE))) {
            throw new DataAccessException("Authentication token verification failed.");
        }

    }

}
