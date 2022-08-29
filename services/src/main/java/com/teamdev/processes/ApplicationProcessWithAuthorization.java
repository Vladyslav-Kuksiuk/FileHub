package com.teamdev.processes;

import com.google.common.base.Preconditions;
import com.teamdev.ServerResponse;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import com.teamdev.util.LocalDateTimeUtil;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * {@link ApplicationProcess} extension with authorization feature.
 *
 * @param <C>
 *         {@link CommandWithAuthorizationData} implementation.
 * @param <R>
 *         {@link ServerResponse} implementation.
 */
public abstract class ApplicationProcessWithAuthorization
        <C extends CommandWithAuthorizationData, R extends ServerResponse>
        implements ApplicationProcess<C, R> {

    private final AuthenticationDao authenticationDao;

    protected ApplicationProcessWithAuthorization(@Nonnull AuthenticationDao authenticationDao) {
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
    }

    /**
     * Method to authorize user by token and token expiration time checking.
     *
     * @param command
     *         {@link CommandWithAuthorizationData} implementation.
     * @throws DataAccessException
     *         If user not authenticated.
     */
    protected void authorize(@Nonnull C command) throws DataAccessException {
        AuthenticationRecord authenticationRecord = authenticationDao.find(command.userId());

        if (!authenticationRecord.authenticationToken()
                                 .equals(command.authenticationToken()) ||
                authenticationRecord.expireTime()
                                    .isBefore(LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE))) {
            throw new DataAccessException("Authentication token verification failed.");
        }

    }

    protected AuthenticationDao authenticationDao() {
        return authenticationDao;
    }

}
