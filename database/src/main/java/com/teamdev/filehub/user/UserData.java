package com.teamdev.filehub.user;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.Data;

import javax.annotation.Nonnull;
import javax.validation.constraints.NotNull;

/**
 * A {@link Data} implementation to store information about user.
 */
public class UserData extends Data {

    private final String login;
    private final String password;
    private final boolean isEmailConfirmed;
    private final String emailHash;

    public UserData(@NotNull String id,
                    @NotNull String login,
                    @NotNull String password,
                    boolean isEmailConfirmed,
                    @Nonnull String emailHash) {

        super(Preconditions.checkNotNull(id));
        this.login = Preconditions.checkNotNull(login);
        this.password = Preconditions.checkNotNull(password);
        this.isEmailConfirmed = isEmailConfirmed;
        this.emailHash = emailHash;
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

    @Override
    public int hashCode() {
        return Objects.hashCode(login, password);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserData)) {
            return false;
        }
        UserData userData = (UserData) o;
        return Objects.equal(login, userData.login) &&
                Objects.equal(password, userData.password) &&
                Objects.equal(isEmailConfirmed, userData.isEmailConfirmed) &&
                Objects.equal(emailHash, userData.emailHash);
    }
}
