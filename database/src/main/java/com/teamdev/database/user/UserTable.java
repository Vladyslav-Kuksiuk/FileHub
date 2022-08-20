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

    private final static String FILE_NAME = "users.json";

    public UserTable() throws DatabaseException {
        super(FILE_NAME);

    }

    /**
     * Method to get data about user by id.
     *
     * @param id
     *         User id.
     * @return {@link UserData} by id.
     * @throws DatabaseTransactionException
     *         if user doesn't exist.
     */
    public UserData getUserById(@NotNull String id) throws DatabaseTransactionException {

        if (!tableMap().containsKey(id)) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        return tableMap().get(id);
    }

    /**
     * Method to add data about new user.
     *
     * @param user
     *         {@link UserData}.
     * @throws DatabaseException
     *         If database connection not working.
     * @throws DatabaseTransactionException
     *         If user already exists.
     */
    public void addUser(@NotNull UserData user) throws DatabaseException,
                                                       DatabaseTransactionException {

        if (tableMap().containsKey(user.id())) {
            throw new DatabaseTransactionException("User with this login already exists.");
        }

        tableMap().put(user.id(), user);

        updateTableInFile();

    }

    /**
     * Method to delete data about user by id.
     *
     * @param id
     *         User id.
     * @throws DatabaseTransactionException
     *         If user doesn't exist.
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void deleteUser(@NotNull String id) throws DatabaseTransactionException,
                                                      DatabaseException {
        if (!tableMap().containsKey(id)) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        tableMap().remove(id);

        updateTableInFile();

    }

    /**
     * Method to update data about user.
     *
     * @param user
     *         {@link UserData}.
     * @throws DatabaseTransactionException
     *         If user already exists.
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void updateUser(@NotNull UserData user) throws DatabaseTransactionException,
                                                          DatabaseException {
        if (!tableMap().containsKey(user.id())) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        tableMap().put(user.id(), user);

        updateTableInFile();

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
