package com.teamdev.processes.register;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.folder.FolderDao;
import com.teamdev.persistent.dao.folder.FolderRecord;
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

    private final FolderDao folderDao;

    @ParametersAreNonnullByDefault
    public UserRegistrationProcessImpl(@Nonnull UserDao userDao,
                                       @Nonnull FolderDao folderDao) {
        this.userDao = userDao;
        this.folderDao = folderDao;
    }

    @Override
    public RecordId<String> handle(@Nonnull UserRegistrationCommand command) throws
                                                                             UserAlreadyRegisteredException {
        logger.atInfo()
              .log("[PROCESS STARTED] - User registration - login: %s.", command.login());

        RecordId<String> userId = new RecordId<>(command.login());

        UserRecord userRecord = new UserRecord(userId,
                                               command.login(),
                                               StringEncryptor.encrypt(command.password()),
                                               command.email());

        try {
            userDao.create(userRecord);

        } catch (DataAccessException exception) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - User registration - login: %s - Exception message: %s.",
                       command.login(), exception.getMessage());

            throw new UserAlreadyRegisteredException(exception.getMessage());
        }

        FolderRecord userRootFolder = new FolderRecord(
                new RecordId<>(command.login() + "_root"),
                userId,
                new RecordId<>(null),
                command.login());

        try {
            folderDao.create(userRootFolder);
        } catch (DataAccessException e) {
            throw new RuntimeException(e);
        }

        logger.atInfo()
              .log("[PROCESS FINISHED] - User registration - login: %s.", command.login());

        return userId;

    }
}
