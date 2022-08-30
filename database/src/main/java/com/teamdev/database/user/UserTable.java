package com.teamdev.database.user;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import javax.validation.constraints.NotNull;
import java.util.Optional;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link UserData}.
 */
public class UserTable extends InMemoryDatabaseTable<String, UserData> {

    private static final String FILE_NAME = "users.json";

    public UserTable() throws DatabaseException {
        super(FILE_NAME, UserData[].class);

    }

    /**
     * Method to get data about user by login.
     *
     * @param login
     *         User login.
     * @return {@link UserData}.
     * @throws DatabaseTransactionException
     *         If user doesn't exist.
     */
    public UserData getUserByLogin(@NotNull String login) throws DatabaseTransactionException {

        Optional<UserData> foundUser = tableMap().values()
                                                 .stream()
                                                 .filter(user -> user.login()
                                                                     .equals(login))
                                                 .findFirst();

        if (foundUser.isEmpty()) {
            throw new DatabaseTransactionException("User with this login doesn't exist.");
        }

        return foundUser.get();

    }

}
