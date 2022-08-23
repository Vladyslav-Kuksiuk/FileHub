package com.teamdev.services.register;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.util.EmailValidator;
import com.teamdev.util.StringEncryptor;

import javax.annotation.Nonnull;

/**
 * {@link UserRegistrationProcess} implementation.
 */
public class UserRegistrationProcessImpl implements UserRegistrationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    public UserRegistrationProcessImpl(@Nonnull UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserRegistrationResponse run(@Nonnull UserRegistrationCommand command) throws
                                                                                  DataAccessException {
        Preconditions.checkState(!command.getLogin()
                                         .isEmpty());
        Preconditions.checkState(!command.getPassword()
                                         .isEmpty());
        Preconditions.checkState(EmailValidator.validate(command.getEmail()));

        logger.atInfo()
              .log("[PROCESS STARTED] - User registration - login: %s", command.getLogin());

        UserRecord userRecord = new UserRecord(new RecordIdentifier<>(command.getLogin()),
                                               command.getLogin(),
                                               StringEncryptor.encrypt(command.getPassword()),
                                               command.getEmail());

        userDao.create(userRecord);

        return new UserRegistrationResponse(new RecordIdentifier<>(command.getLogin()));

    }
}
