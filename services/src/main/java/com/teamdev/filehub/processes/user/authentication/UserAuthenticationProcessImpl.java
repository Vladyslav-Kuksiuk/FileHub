package com.teamdev.filehub.processes.user.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.postman.EmailService;
import com.teamdev.util.LocalDateTimeUtil;
import com.teamdev.util.StringEncryptor;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;
import java.util.Optional;

import static com.teamdev.filehub.processes.user.register.ConfirmationEmail.confirmationEmailText;
import static com.teamdev.filehub.processes.user.register.UserRegistrationProcessImpl.emailConfirmationLink;

/**
 * A {@link UserAuthenticationProcess} implementation.
 */
public class UserAuthenticationProcessImpl implements UserAuthenticationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;
    private final AuthenticationDao authenticationDao;
    private final EmailService emailService;

    public UserAuthenticationProcessImpl(@Nonnull UserDao userDao,
                                         @Nonnull AuthenticationDao authenticationDao,
                                         @Nonnull EmailService emailService) {
        this.userDao = Preconditions.checkNotNull(userDao);
        this.authenticationDao = Preconditions.checkNotNull(authenticationDao);
        this.emailService = Preconditions.checkNotNull(emailService);
    }

    @Override
    public UserAuthenticationResponse handle(@Nonnull UserAuthenticationCommand command)
            throws UserCredentialsMismatchException, UserEmailNotConfirmedException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - User authentication - login: %s.", command.login());

        Optional<UserRecord> optionalUserRecord = userDao.findByLogin(command.login());

        if (optionalUserRecord.isEmpty()) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - User authentication - Login not found - login: %s.",
                       command.login());

            throw new UserCredentialsMismatchException("Authentication data incorrect.");
        }
        UserRecord userRecord = optionalUserRecord.get();

        boolean isPasswordMatch = StringEncryptor.encrypt(command.password())
                                                 .equals(userRecord.password());

        if (!isPasswordMatch) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - User authentication - Password incorrect - login: %s.",
                       command.login());

            throw new UserCredentialsMismatchException("Authentication data incorrect.");
        }

        if(!userRecord.isEmailConfirmed()) {
            logger.atWarning()
                    .log("[PROCESS FAILED] - User authentication - Email is not confirmed - login: %s.",
                            command.login());

            emailService.sendEmail(command.login(), "Confirm your email address",
                    confirmationEmailText(emailConfirmationLink(command.login())));

            throw new UserEmailNotConfirmedException("Email is not confirmed.");
        }

        LocalDateTime authenticationTime = LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE);
        LocalDateTime expireDateTime = authenticationTime.plusDays(1);

        String authenticationToken = StringEncryptor.encrypt(
                userRecord.login() + expireDateTime);

        AuthenticationRecord authenticationRecord =
                new AuthenticationRecord(new RecordId(authenticationToken),
                                         authenticationToken,
                                         expireDateTime,
                                         userRecord.id());

        if (authenticationDao.find(userRecord.id())
                             .isPresent()) {
            authenticationDao.update(authenticationRecord);
        } else {
            authenticationDao.create(authenticationRecord);
        }

        UserAuthenticationResponse response =
                new UserAuthenticationResponse(authenticationToken);

        logger.atInfo()
              .log("[PROCESS FINISHED] - User authentication - login: %s.", command.login());

        return response;
    }
}
