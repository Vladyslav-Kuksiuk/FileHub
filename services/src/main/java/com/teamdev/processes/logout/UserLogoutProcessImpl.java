package com.teamdev.processes.logout;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;

import javax.annotation.Nonnull;

/**
 * {@link UserLogoutProcess} implementation.
 */
public class UserLogoutProcessImpl extends UserLogoutProcess {

    public UserLogoutProcessImpl(@Nonnull
                                         AuthenticationDao authenticationDao) {
        super(authenticationDao);
    }

    /**
     * Method to process {@link UserLogoutCommand}.
     *
     * @param command
     *         {@link UserLogoutCommand}.
     * @return {@link UserLogoutResponse}.
     * @throws DataAccessException
     *         If user not authenticated.
     */
    @Override
    public UserLogoutResponse run(@Nonnull UserLogoutCommand command) throws DataAccessException {
        Preconditions.checkNotNull(command);
        authorize(command);

        authenticationDao().delete(command.userId());

        return new UserLogoutResponse();
    }
}
