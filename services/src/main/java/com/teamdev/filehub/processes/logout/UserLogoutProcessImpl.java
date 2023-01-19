package com.teamdev.filehub.processes.logout;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;

import javax.annotation.Nonnull;

/**
 * {@link UserLogoutProcess} implementation.
 */
public class UserLogoutProcessImpl implements UserLogoutProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final AuthenticationDao authenticationDao;

    public UserLogoutProcessImpl(@Nonnull
                                         AuthenticationDao authenticationDao) {
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);

    }

    /**
     * Method to process {@link UserLogoutCommand}.
     *
     * @param command
     *         {@link UserLogoutCommand}.
     * @return User identifier.
     */
    @Override
    public RecordId<String> handle(@Nonnull UserLogoutCommand command) {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - User logout - login: %s", command.userId()
                                                                         .value());

        authenticationDao.delete(new RecordId<>(command.authenticationToken()));

        logger.atInfo()
              .log("[PROCESS FINISHED] - User logout - login: %s", command.userId()
                                                                          .value());

        return command.userId();
    }
}
