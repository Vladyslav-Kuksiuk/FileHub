package com.teamdev.persistent.dao.user;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.DataAccessObject;

/**
 * {@link DataAccessObject} which is intended to work with user.
 */
public interface UserDao extends DataAccessObject<String, UserRecord> {

    UserRecord findByLogin(String login) throws DataAccessException;
}
