package com.teamdev.database.user;

import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import javax.validation.constraints.NotNull;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link AuthorizationData}.
 */
public class AuthorizationTable extends InMemoryDatabaseTable<String, AuthorizationData> {

    private final static String FILE_NAME = "userAuthorizations.json";

    public AuthorizationTable() throws DatabaseException {
        super(FILE_NAME);

    }

    public AuthorizationData getAuthorizationByUserId(@NotNull String userId) throws
                                                                              DatabaseTransactionException {
        if (!tableMap().containsKey(userId)) {
            throw new DatabaseTransactionException(
                    "User authorization with this id doesn't exist.");
        }

        return tableMap().get(userId);

    }

    public void addUserAuthorization(@NotNull AuthorizationData authorization) throws
                                                                               DatabaseException {

        tableMap().put(authorization.getUserId(), authorization);

        updateTableInFile();

    }

}
