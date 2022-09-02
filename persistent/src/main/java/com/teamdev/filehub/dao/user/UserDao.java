package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.DataAccessObject;

import java.util.Optional;

/**
 * {@link DataAccessObject} which is intended to work with user.
 */
public interface UserDao extends DataAccessObject<String, UserRecord> {

    Optional<UserRecord> findByLogin(String login);
}
