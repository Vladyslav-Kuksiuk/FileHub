package com.teamdev.database.user;

import com.google.common.base.Preconditions;
import com.teamdev.util.EmailValidator;

import javax.validation.constraints.NotNull;

/**
 * Class which is intended to store information about user.
 */
public class UserData {

    private final String id;
    private final String login;
    private final String password;
    private final String email;

    public UserData(@NotNull String id,
                    @NotNull String login,
                    @NotNull String password,
                    @NotNull String email) {

        Preconditions.checkState(!id.isEmpty());
        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());
        Preconditions.checkState(EmailValidator.validate(email));

        this.id = id;
        this.login = login;
        this.password = password;
        this.email = email;
    }

    public String getId() {
        return id;
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
