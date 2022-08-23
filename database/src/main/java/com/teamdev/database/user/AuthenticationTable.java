package com.teamdev.database.user;

import com.google.common.base.Preconditions;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import javax.validation.constraints.NotNull;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link AuthenticationData}.
 */
public class AuthenticationTable extends InMemoryDatabaseTable<String, AuthenticationData> {

    private final static String FILE_NAME = "userAuthentication.json";

    public AuthenticationTable() throws DatabaseException {
        super(FILE_NAME, AuthenticationData[].class);

    }

    /**
     * Method to get {@link AuthenticationData} from table.
     *
     * @param userId
     *         Authenticated user id.
     * @return {@link AuthenticationData}.
     * @throws DatabaseTransactionException
     *         If database connection not working.
     */

    public AuthenticationData getAuthorizationByUserId(@NotNull String userId) throws
                                                                               DatabaseTransactionException {
        Preconditions.checkNotNull(userId);

        if (!tableMap().containsKey(userId)) {
            throw new DatabaseTransactionException(
                    "Authentication with this id doesn't exist.");
        }

        return tableMap().get(userId);

    }

    /**
     * Method to add {@link AuthenticationData} to the table.
     *
     * @param authentication
     *         {@link AuthenticationData}.
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void addAuthorization(@NotNull AuthenticationData authentication) throws
                                                                             DatabaseException {

        Preconditions.checkNotNull(authentication);

        tableMap().put(authentication.id(), authentication);

        updateTableInFile();

    }

    /**
     * Method to delete {@link AuthenticationData} from the table.
     *
     * @param userId
     *         Authenticated user id.
     * @throws DatabaseTransactionException
     *         If authentication doesn't exist.
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void deleteAuthorization(@NotNull String userId) throws DatabaseTransactionException,
                                                                   DatabaseException {
        Preconditions.checkNotNull(userId);

        if (!tableMap().containsKey(userId)) {
            throw new DatabaseTransactionException("Authentication with this id doesn't exist.");
        }

        tableMap().remove(userId);

        updateTableInFile();

    }

    /**
     * Method to add {@link AuthenticationData} to the table.
     *
     * @param authentication
     *         {@link AuthenticationData}.
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void addUserAuthentication(@NotNull AuthenticationData authentication) throws
                                                                                  DatabaseException {

        Preconditions.checkNotNull(authentication);

        tableMap().put(authentication.id(), authentication);

        updateTableInFile();
    }

    /**
     * Method to update {@link AuthenticationData} in the table.
     *
     * @param authentication
     *         {@link AuthenticationData}.
     * @throws DatabaseTransactionException
     *         If authentication doesn't exist.
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void updateAuthorization(@NotNull AuthenticationData authentication) throws
                                                                                DatabaseTransactionException,
                                                                                DatabaseException {

        Preconditions.checkNotNull(authentication);

        if (!tableMap().containsKey(authentication.id())) {
            throw new DatabaseTransactionException("Authentication with this id doesn't exist.");
        }

        tableMap().put(authentication.id(), authentication);

        updateTableInFile();

    }

}
