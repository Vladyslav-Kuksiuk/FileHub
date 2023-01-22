package com.teamdev.filehub.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabaseTable;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * Implementation of {@link InMemoryDatabaseTable} to work with {@link AuthenticationData}.
 */
public class AuthenticationTable extends InMemoryDatabaseTable<AuthenticationData> {

    public AuthenticationTable(@Nonnull String filePath) {
        super(Preconditions.checkNotNull(filePath),
              AuthenticationData[].class);

    }

    /**
     * Method to get {@link AuthenticationData} from table by token.
     *
     * @param token
     *         Authenticated user token.
     * @return {@link Optional<AuthenticationData>}.
     */

    public Optional<AuthenticationData> findByToken(@Nonnull String token) {
        Preconditions.checkNotNull(token);

        return tableMap().values()
                .stream()
                .filter(auth -> auth.authenticationToken()
                                    .equals(token))
                .findFirst();

    }

}
