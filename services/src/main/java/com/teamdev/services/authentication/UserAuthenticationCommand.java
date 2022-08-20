package com.teamdev.services.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.services.Command;

import javax.validation.constraints.NotNull;

/**
 * A {@link Command} implementation which is intended to store
 * data about user authentication.
 */
public class UserAuthenticationCommand implements Command {

    private final String login;
    private final String password;

    public UserAuthenticationCommand(@NotNull String login,
                                     @NotNull String password) {

        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());

        this.login = login;
        this.password = password;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }

}
