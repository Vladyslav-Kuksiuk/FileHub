package com.teamdev.processes.register;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.util.StringEncryptor;

import javax.annotation.Nonnull;
import javax.annotation.ParametersAreNonnullByDefault;

/**
 * {@link UserRegistrationProcess} implementation.
 */
public class UserRegistrationProcessImpl implements UserRegistrationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    @ParametersAreNonnullByDefault
    public UserRegistrationProcessImpl(UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public RecordIdentifier<String> run(@Nonnull UserRegistrationCommand command) throws
                                                                                  DataAccessException {
        logger.atInfo()
              .log("[PROCESS STARTED] - User registration - login: %s", command.getLogin());

        RecordIdentifier<String> userId = new RecordIdentifier<>(command.getLogin());

        UserRecord userRecord = new UserRecord(userId,
                                               command.getLogin(),
                                               StringEncryptor.encrypt(command.getPassword()),
                                               command.getEmail());

        userDao.create(userRecord);

        return userId;

    }
}
