package com.teamdev.filehub.processes.register;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.processes.Command;
import com.teamdev.util.EmailValidator;

import javax.annotation.Nonnull;

/**
 * A {@link Command} implementation which is intended to store
 * data about user registration.
 */
public class UserRegistrationCommand implements Command {

    private final String login;
    private final String password;

    public UserRegistrationCommand(@Nonnull String login,
                                   @Nonnull String password) {

        Preconditions.checkNotNull(login);
        Preconditions.checkNotNull(password);

        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());

        this.login = login;
        this.password = password;
    }

    public String login() {
        return login;
    }

    public String password() {
        return password;
    }
}
