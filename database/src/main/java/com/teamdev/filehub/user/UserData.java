package com.teamdev.filehub.user;

import com.google.common.base.Objects;
import com.google.common.base.Preconditions;
import com.teamdev.filehub.Data;

import javax.validation.constraints.NotNull;

/**
 * Class which is intended to store information about user.
 */
public class UserData extends Data {

    private final String login;
    private final String password;

    public UserData(@NotNull String id,
                    @NotNull String login,
                    @NotNull String password) {

        super(Preconditions.checkNotNull(id));
        this.login = Preconditions.checkNotNull(login);
        this.password = Preconditions.checkNotNull(password);
    }

    public String login() {
        return login;
    }

    public String password() {
        return password;
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
                Objects.equal(password, userData.password);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(login, password);
    }
}
