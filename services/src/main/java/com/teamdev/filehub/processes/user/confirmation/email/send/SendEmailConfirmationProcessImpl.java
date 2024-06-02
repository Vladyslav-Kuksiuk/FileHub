package com.teamdev.filehub.processes.user.confirmation.email.send;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.postman.EmailService;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationCommand;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationProcess;

import javax.annotation.Nonnull;
import javax.annotation.ParametersAreNonnullByDefault;

import static com.teamdev.filehub.processes.user.register.ConfirmationEmail.confirmationEmailText;
import static com.teamdev.filehub.processes.user.register.UserRegistrationProcessImpl.emailConfirmationLink;

public class SendEmailConfirmationProcessImpl implements SendEmailConfirmationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;
    private final EmailService emailService;

    @ParametersAreNonnullByDefault
    public SendEmailConfirmationProcessImpl(@Nonnull UserDao userDao,
                                            @Nonnull EmailService emailService) {
        this.userDao = userDao;
        this.emailService = emailService;
    }

    @Override
    public RecordId handle(SendEmailConfirmationCommand command) throws DataNotFoundException {
        logger.atInfo()
                .log("[PROCESS STARTED] - Send email confirmation");

        var oUser = userDao.findByLogin(command.email());

        if (oUser.isEmpty()) {
            logger.atInfo()
                    .log("[PROCESS FAILED] - Send email confirmation - User with provided email is not registered");
            throw new DataNotFoundException("User with provided email is not registered.");
        }
        var user = oUser.get();

        emailService.sendEmail(command.email(), "Confirm your email address",
                confirmationEmailText(emailConfirmationLink(command.email())));

        logger.atInfo()
                .log("[PROCESS FINISHED] - Send email confirmation");

        return user.id();
    }
}
