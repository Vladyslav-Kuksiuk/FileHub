package com.teamdev.persistent.dao.user;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.DataAccessObject;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;

/**
 * {@link DataAccessObject} which is intended to work with user.
 */
public interface UserDao extends DataAccessObject<UserRecord, String> {

    UserRecord findByLogin(@NotNull String login) throws DataAccessException;

    void authenticate(AuthenticationRecord authenticationRecord) throws DataAccessException;

    AuthenticationRecord findAuthentication(RecordIdentifier<String> id) throws DataAccessException;

}
