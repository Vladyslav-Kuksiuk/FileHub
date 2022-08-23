package com.teamdev.services.logout;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;

import javax.validation.constraints.NotNull;

/**
 * {@link UserLogoutProcess} implementation.
 */
public class UserLogoutProcessImpl extends UserLogoutProcess {

    public UserLogoutProcessImpl(
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
    public UserLogoutResponse run(@NotNull UserLogoutCommand command) throws DataAccessException {
        Preconditions.checkNotNull(command);
        authorize(command);

        authenticationDao().delete(command.userId());

        return new UserLogoutResponse();
    }
}
