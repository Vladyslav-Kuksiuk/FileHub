package com.teamdev.services.register;

import com.google.common.base.Preconditions;
import com.teamdev.services.Command;
import com.teamdev.util.EmailValidator;

import javax.validation.constraints.NotNull;

/**
 * A {@link Command} implementation which is intended to store
 * data about user registration.
 */
public class UserRegistrationCommand implements Command {

    private final String login;
    private final String password;
    private final String email;

    public UserRegistrationCommand(@NotNull String login,
                                   @NotNull String password,
                                   @NotNull String email) {

        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());
        Preconditions.checkState(EmailValidator.validate(email));

        this.login = login;
        this.password = password;
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }
}
