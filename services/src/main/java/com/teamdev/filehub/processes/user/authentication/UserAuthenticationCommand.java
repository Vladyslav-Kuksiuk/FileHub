package com.teamdev.filehub.processes.user.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;

/**
 * A {@link Command} implementation to represent 'authenticate user' request.
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
