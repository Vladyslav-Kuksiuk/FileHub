package com.teamdev.database.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import javax.annotation.Nonnull;

/**
 * Implementation of {@link InMemoryDatabaseTable} to store {@link AuthenticationData}.
 */
public class AuthenticationTable extends InMemoryDatabaseTable<String, AuthenticationData> {

    private static final String FILE_NAME = "userAuthentication.json";

    public AuthenticationTable() {
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

}
