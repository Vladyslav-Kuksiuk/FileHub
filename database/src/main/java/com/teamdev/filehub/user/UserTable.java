package com.teamdev.filehub.user;

import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.validation.constraints.NotNull;
import java.util.Optional;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link UserData}.
 */
public class UserTable extends InMemoryDatabaseTable<String, UserData> {

    private static final String FILE_NAME = "users.json";

    public UserTable() {
        super(FILE_NAME, UserData[].class);

    }

    /**
     * Method to get data about user by login.
     *
     * @param login
     *         User login.
     * @return {@link UserData}.
     */
    public Optional<UserData> getUserByLogin(@NotNull String login) {

        Optional<UserData> foundUser = tableMap().values()
                                                 .stream()
                                                 .filter(user -> user.login()
                                                                     .equals(login))
                                                 .findFirst();

        return foundUser;

    }

}
