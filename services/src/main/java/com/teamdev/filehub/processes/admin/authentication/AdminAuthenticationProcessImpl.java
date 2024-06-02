package com.teamdev.filehub.processes.admin.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.processes.user.authentication.UserCredentialsMismatchException;

import javax.annotation.Nonnull;

/**
 * A {@link AdminAuthenticationProcess} implementation.
 */
public class AdminAuthenticationProcessImpl implements AdminAuthenticationProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    public static String ADMIN_TOKEN = "bdfs876dgfsnpd9f78hp9s8hdnf9spdf09jsdd8budvsxo90cv[a-0ws9djedgf7rx9sc8vasre45";

    @Override
    public AdminAuthenticationResponse handle(@Nonnull AdminAuthenticationCommand command)
            throws UserCredentialsMismatchException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - Admin authentication - login: %s.", command.login());

        if (!command.login().equals("vlad.kuksiuk@gmail.com") || !command.password().equals("qweqwe123123")) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - Admin authentication - Password incorrect - login: %s.",
                       command.login());

            throw new UserCredentialsMismatchException("Authentication data incorrect.");
        }

        AdminAuthenticationResponse response = new AdminAuthenticationResponse(ADMIN_TOKEN);

        logger.atInfo()
              .log("[PROCESS FINISHED] - User authentication - login: %s.", command.login());

        return response;
    }
}
