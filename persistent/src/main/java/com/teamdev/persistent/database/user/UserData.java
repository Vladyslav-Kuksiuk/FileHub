package com.teamdev.persistent.database.user;

import com.google.common.base.Preconditions;
import com.teamdev.util.EmailValidator;

import javax.validation.constraints.NotNull;

public class UserData {

    private final String login;
    private final String password;
    private final String email;

    public UserData(@NotNull String login,
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
