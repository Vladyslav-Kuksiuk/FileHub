package com.teamdev.filehub.processes.user.confirmation.email.confirm;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;

public class EmailConfirmationCommand implements Command {

    private final String emailConfirmationToken;

    public EmailConfirmationCommand(@Nonnull String emailConfirmationToken) {
        Preconditions.checkNotNull(emailConfirmationToken);

        this.emailConfirmationToken = emailConfirmationToken;
    }

    public String emailConfirmationToken() {
        return emailConfirmationToken;
    }
}
