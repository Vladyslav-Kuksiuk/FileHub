package com.teamdev.persistent.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DatabaseRecord;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.util.EmailValidator;

import javax.validation.constraints.NotNull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about the user.
 */
public class UserRecord extends DatabaseRecord<String> {

    private final String login;
    private final String password;
    private final String email;

    public UserRecord(@NotNull RecordIdentifier<String> id,
                      @NotNull String login,
                      @NotNull String password,
                      @NotNull String email) {
        super(Preconditions.checkNotNull(id));

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
