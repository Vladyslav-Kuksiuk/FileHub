package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.DataAccessObject;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link DataAccessObject} which is intended to work with user.
 */
public interface UserDao extends DataAccessObject<UserRecord> {

    Optional<UserRecord> findByLogin(@Nonnull String login);
}
