package com.teamdev.filehub.user;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.annotation.Nonnull;
import javax.validation.constraints.NotNull;
import java.util.Optional;

/**
 * {@link InMemoryDatabaseTable} implementation to work with {@link UserData}.
 */
public class UserTable extends InMemoryDatabaseTable<UserData> {

    public UserTable(@Nonnull String filePath) {
        super(Preconditions.checkNotNull(filePath),
              UserData[].class);

    }

    /**
     * Method to get data about user by login.
     *
     * @param login
     *         User login.
     * @return Optional {@link UserData} .
     */
    public Optional<UserData> getUserByLogin(@NotNull String login) {

        Optional<UserData> foundUser = tableMap().values()
                .stream()
                .filter(user -> user.login()
                                    .equals(login))
                .findFirst();

        return foundUser;

    }

    public Optional<UserData> getUserByEmailHash(@NotNull String emailHash) {

        Optional<UserData> foundUser = tableMap().values()
                .stream()
                .filter(user -> user.emailHash()
                        .equals(emailHash))
                .findFirst();

        return foundUser;

    }

}
