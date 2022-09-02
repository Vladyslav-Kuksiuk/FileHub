package com.teamdev.filehub.dao.user;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.util.EmailValidator;

import javax.annotation.Nonnull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about the user.
 */
public class UserRecord extends DatabaseRecord<String> {

    private final String login;
    private final String password;
    private final String email;

    public UserRecord(@Nonnull RecordId<String> id,
                      @Nonnull String login,
                      @Nonnull String password,
                      @Nonnull String email) {
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
