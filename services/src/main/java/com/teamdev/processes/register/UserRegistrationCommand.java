package com.teamdev.processes.register;

import com.google.common.base.Preconditions;
import com.teamdev.processes.Command;
import com.teamdev.util.EmailValidator;

import javax.annotation.Nonnull;

/**
 * A {@link Command} implementation which is intended to store
 * data about user registration.
 */
public class UserRegistrationCommand implements Command {

    private final String login;
    private final String password;
    private final String email;

    public UserRegistrationCommand(@Nonnull String login,
                                   @Nonnull String password,
                                   @Nonnull String email) {

        Preconditions.checkNotNull(login);
        Preconditions.checkNotNull(password);
        Preconditions.checkNotNull(email);

        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());
        Preconditions.checkState(EmailValidator.validate(email));

        this.login = login;
        this.password = password;
        this.email = email;
    }

    public String login() {
        return login;
    }

    public String password() {
        return password;
    }

    public String email() {
        return email;
    }
}
