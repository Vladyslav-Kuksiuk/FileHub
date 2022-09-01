package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.DataAccessException;
import com.teamdev.filehub.dao.DataAccessObject;

/**
 * {@link DataAccessObject} which is intended to work with user.
 */
public interface UserDao extends DataAccessObject<String, UserRecord> {

    UserRecord findByLogin(String login) throws DataAccessException;
}
