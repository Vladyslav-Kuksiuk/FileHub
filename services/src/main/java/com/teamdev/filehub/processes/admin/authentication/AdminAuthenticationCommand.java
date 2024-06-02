package com.teamdev.filehub.processes.admin.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.processes.Command;

import javax.annotation.Nonnull;

/**
 * A {@link Command} implementation to represent 'authenticate admin' request.
 */
public class AdminAuthenticationCommand implements Command {

    private final String login;
    private final String password;

    public AdminAuthenticationCommand(@Nonnull String login,
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
