package com.teamdev.filehub.dao.user;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.DatabaseRecord;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;

/**
 * {@link DatabaseRecord} implementation which is intended to store data about the user.
 */
public class UserRecord extends DatabaseRecord {

    private final String login;
    private final String password;

    public UserRecord(@Nonnull RecordId id,
                      @Nonnull String login,
                      @Nonnull String password) {
        super(Preconditions.checkNotNull(id));

        Preconditions.checkNotNull(login);
        Preconditions.checkNotNull(password);

        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());

        this.login = login;
        this.password = password;
    }

    public String login() {
        return login;
    }

    public String password() {
        return password;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(login, password);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserRecord)) {
            return false;
        }
        UserRecord that = (UserRecord) o;
        return Objects.equal(id(), that.id()) &&
                Objects.equal(login, that.login) &&
                Objects.equal(password, that.password);
    }
}
