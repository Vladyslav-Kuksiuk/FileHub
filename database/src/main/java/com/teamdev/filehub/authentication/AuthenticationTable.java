package com.teamdev.filehub.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * Implementation of {@link InMemoryDatabaseTable} to store {@link AuthenticationData}.
 */
public class AuthenticationTable extends InMemoryDatabaseTable<String, AuthenticationData> {

    public AuthenticationTable(String filePath) {
        super(filePath, AuthenticationData[].class);

    }

    /**
     * Method to get {@link AuthenticationData} from table.
     *
     * @param userId
     *         Authenticated user id.
     * @return {@link AuthenticationData}.
     */

    public Optional<AuthenticationData> findByUserId(@Nonnull String userId) {
        Preconditions.checkNotNull(userId);

        return Optional.ofNullable(tableMap().get(userId));

    }

}
