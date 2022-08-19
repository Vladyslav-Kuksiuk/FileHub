package com.teamdev.services.register;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.ApplicationProcess;
import com.teamdev.util.EmailValidator;
import com.teamdev.util.StringEncryptor;

import javax.validation.constraints.NotNull;

/**
 * A {@link ApplicationProcess} implementation which is intended to process
 * user registration.
 */
public class UserRegistrationProcess implements ApplicationProcess<UserRegistrationCommand, UserRegistrationResponse> {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    public UserRegistrationProcess(@NotNull UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public UserRegistrationResponse run(@NotNull UserRegistrationCommand command) throws
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
