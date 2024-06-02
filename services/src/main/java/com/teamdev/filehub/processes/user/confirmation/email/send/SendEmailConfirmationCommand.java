package com.teamdev.filehub.processes.user.confirmation.email.send;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;

public class SendEmailConfirmationCommand implements Command {

    private final String email;

    public SendEmailConfirmationCommand(@Nonnull String email) {
        Preconditions.checkNotNull(email);

        this.email = email;
    }

    public String email() {
        return email;
    }
}
