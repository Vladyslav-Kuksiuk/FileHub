package com.teamdev.filehub.processes.user.register;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.postman.EmailService;
import com.teamdev.util.StringEncryptor;

import javax.annotation.Nonnull;
import javax.annotation.ParametersAreNonnullByDefault;

import static com.teamdev.filehub.processes.user.register.ConfirmationEmail.confirmationEmailText;
import static com.teamdev.util.StringEncryptor.encrypt;

/**
 * {@link UserRegistrationProcess} implementation.
 */
public class UserRegistrationProcessImpl implements UserRegistrationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;

    private final FolderDao folderDao;
    private final EmailService emailService;

    @ParametersAreNonnullByDefault
    public UserRegistrationProcessImpl(@Nonnull UserDao userDao,
                                       @Nonnull FolderDao folderDao,
                                       @Nonnull EmailService emailService) {
        this.userDao = userDao;
        this.folderDao = folderDao;
        this.emailService = emailService;
    }

    @Override
    public RecordId handle(@Nonnull UserRegistrationCommand command)
            throws UserAlreadyRegisteredException {
        logger.atInfo()
              .log("[PROCESS STARTED] - User registration - login: %s.", command.login());

        RecordId userId = new RecordId(command.login());

        UserRecord userRecord = new UserRecord(userId,
                                               command.login(),
                                               encrypt(command.password()),
                                               false,
                                               encrypt(command.login()));

        if (userDao.findByLogin(command.login())
                   .isPresent()) {
            logger.atInfo()
                  .log("[PROCESS FAILED] - User registration - User already registered - login: %s.", command.login());
            throw new UserAlreadyRegisteredException("User already registered.");
        }

        userDao.create(userRecord);

        FolderRecord userRootFolder = new FolderRecord(
                new RecordId(command.login() + "_root"),
                userId,
                new RecordId(null),
                command.login());

        folderDao.create(userRootFolder);

        emailService.sendEmail(command.login(), "Confirm your email address",
                confirmationEmailText(emailConfirmationLink(command.login())));

        logger.atInfo()
              .log("[PROCESS FINISHED] - User registration - login: %s.", command.login());

        return userId;

    }

    public static String emailConfirmationLink(String email) {
        return "http://localhost:4567/confirm-email/" + encrypt(email);
    }
}
