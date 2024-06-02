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
    private final boolean isEmailConfirmed;
    private final String emailHash;
    private final boolean isBanned;

    public UserRecord(@Nonnull RecordId id,
                      @Nonnull String login,
                      @Nonnull String password,
                      boolean isEmailConfirmed,
                      @Nonnull String emailHash,
                      boolean isBanned) {
        super(Preconditions.checkNotNull(id));

        Preconditions.checkNotNull(login);
        Preconditions.checkNotNull(password);
        Preconditions.checkNotNull(emailHash);

        Preconditions.checkState(!login.isEmpty());
        Preconditions.checkState(!password.isEmpty());
        Preconditions.checkState(!emailHash.isEmpty());

        this.login = login;
        this.password = password;
        this.isEmailConfirmed = isEmailConfirmed;
        this.emailHash = emailHash;
        this.isBanned = isBanned;
    }

    public String login() {
        return login;
    }

    public String password() {
        return password;
    }

    public boolean isEmailConfirmed() {
        return isEmailConfirmed;
    }

    public String emailHash() {
        return emailHash;
    }

    public boolean isBanned() {
        return isBanned;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(login, password, isEmailConfirmed, emailHash);
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
                Objects.equal(password, that.password) &&
                Objects.equal(isEmailConfirmed, that.isEmailConfirmed) &&
                Objects.equal(emailHash, that.emailHash) &&
                Objects.equal(isBanned, that.isBanned);
    }
}
