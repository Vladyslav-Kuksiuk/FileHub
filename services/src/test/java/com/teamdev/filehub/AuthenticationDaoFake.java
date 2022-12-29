package com.teamdev.filehub;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

public class AuthenticationDaoFake implements AuthenticationDao {

    private final Map<RecordId<String>, AuthenticationRecord> authentications = new HashMap<>();

    public Map<RecordId<String>, AuthenticationRecord> authenticationsMap() {
        return Collections.unmodifiableMap(authentications);
    }

    @Override
    public Optional<AuthenticationRecord> find(RecordId<String> id) {

        Preconditions.checkNotNull(id);

        return Optional.ofNullable(authentications.get(id));
    }

    @Override
    public void delete(RecordId<String> id) {

        Preconditions.checkNotNull(id);

        if (!authentications.containsKey(id)) {
            throw new RuntimeException("Authentication not found.");
        }
        authentications.remove(id);
    }

    @Override
    public void create(AuthenticationRecord record) {

        Preconditions.checkNotNull(record);

        authentications.put(record.id(), record);
    }

    @Override
    public void update(AuthenticationRecord record) {

        Preconditions.checkNotNull(record);

        if (!authentications.containsKey(record.id())) {
            throw new RuntimeException("Authentication not found.");
        }

        authentications.put(record.id(), record);

    }

    @Override
    public Optional<AuthenticationRecord> findByToken(String token) {
        return Optional.empty();
    }
}
