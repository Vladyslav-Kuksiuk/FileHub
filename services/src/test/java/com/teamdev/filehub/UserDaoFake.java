package com.teamdev.filehub;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.dao.user.UserRecord;

import javax.annotation.Nonnull;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class UserDaoFake implements UserDao {

    private final Map<RecordId, UserRecord> users = new HashMap<>();

    public Map<RecordId, UserRecord> usersMap() {
        return Collections.unmodifiableMap(users);
    }

    @Override
    public Optional<UserRecord> find(RecordId id) {

        return Optional.ofNullable(users.get(id));
    }

    @Override
    public void delete(RecordId id) {

        if (!users.containsKey(id)) {
            throw new RuntimeException("User not found.");
        }
        users.remove(id);
    }

    @Override
    public void create(UserRecord record) {

        if (users.containsKey(record.id())) {
            throw new RuntimeException("User already exists.");
        }

        users.put(record.id(), record);
    }

    @Override
    public void update(UserRecord record) {

        if (!users.containsKey(record.id())) {
            throw new RuntimeException("User not found.");
        }

        users.put(record.id(), record);

    }

    @Override
    public Optional<UserRecord> findByLogin(String login) {

        Optional<UserRecord> optionalUser = users.values()
                .stream()
                .filter(user -> user.login()
                                    .equals(login))
                .findFirst();

        return optionalUser;
    }

    @Override
    public Optional<UserRecord> findByEmailHash(@Nonnull String emailHash) {
        Optional<UserRecord> optionalUser = users.values()
                .stream()
                .filter(user -> user.emailHash()
                        .equals(emailHash))
                .findFirst();
        return optionalUser;
    }
}
