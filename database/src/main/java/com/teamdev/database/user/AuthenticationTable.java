package com.teamdev.database.user;

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
        super(FILE_NAME);

    }

    /**
     * Method to get {@link AuthenticationData} from table.
     *
     * @param userId
     *         Authorized user id.
     * @return {@link AuthenticationData}.
     * @throws DatabaseTransactionException
     *         If database connection not working.
     */
    public AuthenticationData getAuthenticationByUserId(@NotNull String userId) throws
                                                                                DatabaseTransactionException {
        if (!tableMap().containsKey(userId)) {
            throw new DatabaseTransactionException(
                    "User authentication with this id doesn't exist.");
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
    public void addUserAuthentication(@NotNull AuthenticationData authentication) throws
                                                                                  DatabaseException {

        tableMap().put(authentication.userId(), authentication);

        updateTableInFile();

    }

}
