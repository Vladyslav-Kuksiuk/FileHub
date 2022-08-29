package com.teamdev.processes.logout;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;

import javax.annotation.Nonnull;

/**
 * {@link UserLogoutProcess} implementation.
 */
public class UserLogoutProcessImpl implements UserLogoutProcess {

    private final AuthenticationDao authenticationDao;

    public UserLogoutProcessImpl(@Nonnull
                                 AuthenticationDao authenticationDao) {
        this.authenticationDao = authenticationDao;

    }

    /**
     * Method to process {@link UserLogoutCommand}.
     *
     * @param command
     *         {@link UserLogoutCommand}.
     * @return User identifier.
     * @throws DataAccessException
     *         If user not authenticated.
     */
    @Override
    public RecordIdentifier<String> run(@Nonnull UserLogoutCommand command) throws
                                                                            DataAccessException {
        Preconditions.checkNotNull(command);

        authenticationDao.delete(command.userId());

        return command.userId();
    }
}
