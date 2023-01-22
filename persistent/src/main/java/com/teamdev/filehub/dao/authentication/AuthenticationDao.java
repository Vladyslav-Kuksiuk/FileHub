package com.teamdev.filehub.dao.authentication;

import com.teamdev.filehub.dao.DataAccessObject;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link DataAccessObject} which is intended to work with authentication.
 */
public interface AuthenticationDao extends DataAccessObject<AuthenticationRecord> {

    /**
     * Finds {@link AuthenticationRecord} by token.
     *
     * @param token
     *         The authentication token.
     * @return Optional founded {@link AuthenticationRecord}.
     */
    Optional<AuthenticationRecord> findByToken(@Nonnull String token);
}
