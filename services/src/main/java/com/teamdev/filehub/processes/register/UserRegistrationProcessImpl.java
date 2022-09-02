package com.teamdev.filehub.processes.register;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
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

        if (userDao.findByLogin(command.login())
                   .isPresent()) {
            throw new UserAlreadyRegisteredException("User already registered.");
        }
        ;

        userDao.create(userRecord);

        FolderRecord userRootFolder = new FolderRecord(
                new RecordId<>(command.login() + "_root"),
                userId,
                new RecordId<>(null),
                command.login());

        folderDao.create(userRootFolder);

        logger.atInfo()
              .log("[PROCESS FINISHED] - User registration - login: %s.", command.login());

        return userId;

    }
}
