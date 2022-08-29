package com.teamdev.database.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import javax.annotation.Nonnull;

/**
 * Implementation of {@link InMemoryDatabaseTable} to store {@link AuthenticationData}.
 */
public class AuthenticationTable extends InMemoryDatabaseTable<String, AuthenticationData> {

    private static final String FILE_NAME = "userAuthentication.json";
    private final Object locker = new Object();

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

    public AuthenticationData getAuthenticationByUserId(@Nonnull String userId) throws
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
    public void addAuthentication(@Nonnull AuthenticationData authentication) throws
                                                                              DatabaseException {
        synchronized (locker) {
            Preconditions.checkNotNull(authentication);

            tableMap().put(authentication.id(), authentication);

            updateTableInFile();
        }

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
    public void deleteAuthentication(@Nonnull String userId) throws DatabaseTransactionException,
                                                                    DatabaseException {
        Preconditions.checkNotNull(userId);
        synchronized (locker) {
            if (!tableMap().containsKey(userId)) {
                throw new DatabaseTransactionException(
                        "Authentication with this id doesn't exist.");
            }

            tableMap().remove(userId);

            updateTableInFile();
        }

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
    public void updateAuthentication(@Nonnull AuthenticationData authentication) throws
                                                                                 DatabaseTransactionException,
                                                                                 DatabaseException {

        Preconditions.checkNotNull(authentication);
        synchronized (locker) {
            if (!tableMap().containsKey(authentication.id())) {
                throw new DatabaseTransactionException(
                        "Authentication with this id doesn't exist.");
            }

            tableMap().put(authentication.id(), authentication);

            updateTableInFile();
        }

    }

}
