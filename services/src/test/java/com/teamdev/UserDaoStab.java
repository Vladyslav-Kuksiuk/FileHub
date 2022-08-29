package com.teamdev;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.dao.user.UserRecord;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class UserDaoStab implements UserDao {

    private final Map<RecordId<String>, UserRecord> users = new HashMap<>();

    public Map<RecordId<String>, UserRecord> usersMap() {
        return Collections.unmodifiableMap(users);
    }

    @Override
    public UserRecord find(RecordId<String> id) throws DataAccessException {

        Preconditions.checkNotNull(id);

        if (!users.containsKey(id)) {
            throw new DataAccessException("User not found.");
        }

        return users.get(id);
    }

    @Override
    public void delete(RecordId<String> id) throws DataAccessException {

        Preconditions.checkNotNull(id);

        if (!users.containsKey(id)) {
            throw new DataAccessException("User not found.");
        }
        users.remove(id);
    }

    @Override
    public void create(UserRecord record) throws DataAccessException {

        Preconditions.checkNotNull(record);

        users.put(record.getId(), record);
    }

    @Override
    public void update(UserRecord record) throws DataAccessException {

        Preconditions.checkNotNull(record);

        if (!users.containsKey(record.getId())) {
            throw new DataAccessException("User not found.");
        }

        users.put(record.getId(), record);

    }

    @Override
    public UserRecord findByLogin(String login) throws DataAccessException {

        Preconditions.checkNotNull(login);

        Optional<UserRecord> optionalUser = users.values()
                                                 .stream()
                                                 .filter(user -> user.login()
                                                                     .equals(login))
                                                 .findFirst();

        if (optionalUser.isEmpty()) {
            throw new DataAccessException("User not found.");
        }

        return optionalUser.get();
    }
}
