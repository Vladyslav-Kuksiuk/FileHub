package com.teamdev.services.register;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;
import com.teamdev.services.ProcessService;
import com.teamdev.util.EmailValidator;
import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

import javax.validation.constraints.NotNull;

/**
 * A {@link ProcessService} implementation which is intended to process
 * user registration.
 */
public class UserRegistrationProcess implements ProcessService<UserRegistrationCommand> {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    public UserRegistrationProcess(@NotNull UserDao userDao) {
        this.userDao = userDao;
    }

    @Override
    public void run(@NotNull UserRegistrationCommand command) {
        Preconditions.checkState(!command.getLogin()
                                         .isEmpty());
        Preconditions.checkState(!command.getPassword()
                                         .isEmpty());
        Preconditions.checkState(EmailValidator.validate(command.getEmail()));

        logger.atInfo()
              .log("[PROCESS STARTED] - User registration");

        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword("secret-word");

        UserRecord userRecord = new UserRecord(new RecordIdentifier<>(command.getLogin()),
                                               command.getLogin(),
                                               encryptor.encrypt(command.getPassword()),
                                               command.getEmail());

        userDao.create(userRecord);

    }
}
