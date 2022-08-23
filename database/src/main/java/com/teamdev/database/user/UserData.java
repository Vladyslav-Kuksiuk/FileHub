package com.teamdev.database.user;

import com.google.common.base.Preconditions;
import com.teamdev.database.Data;
import com.teamdev.util.EmailValidator;

import javax.validation.constraints.NotNull;

/**
 * Class which is intended to store information about user.
 */
public class UserData extends Data<String> {

    private final String login;
    private final String password;
    private final String email;

    public UserData(@NotNull String id,
                    @NotNull String login,
                    @NotNull String password,
                    @NotNull String email) {
        super(Preconditions.checkNotNull(id));
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
