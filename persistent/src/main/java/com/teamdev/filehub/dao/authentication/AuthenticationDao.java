package com.teamdev.filehub.dao.authentication;

import com.teamdev.filehub.dao.DataAccessObject;

import java.util.Optional;

/**
 * {@link DataAccessObject} which is intended to work with authentication.
 */
public interface AuthenticationDao extends DataAccessObject<String, AuthenticationRecord> {
    Optional<AuthenticationRecord> findByToken(String token);
}
