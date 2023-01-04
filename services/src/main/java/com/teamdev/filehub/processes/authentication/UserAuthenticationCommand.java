package com.teamdev.filehub.processes.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;

/**
 * A {@link Command} implementation which is intended to store
 * data about user authentication.
 */
public class UserAuthenticationCommand implements Command {

    private final String login;
    private final String password;

    public UserAuthenticationCommand(@Nonnull String login,
                                     @Nonnull String password) {
        Preconditions.checkNotNull(login);
        Preconditions.checkNotNull(password);

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
