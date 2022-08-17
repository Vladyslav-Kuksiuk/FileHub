package com.teamdev.persistent.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.util.EmailValidator;

import javax.validation.constraints.NotNull;

public class UserRecord extends DatabaseRecord {

    private final String login;
    private final String password;
    private final String email;

    public UserRecord(@NotNull RecordIdentifier<String> id,
                      @NotNull String login,
                      @NotNull String password,
                      @NotNull String email) {
        super(id);

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
