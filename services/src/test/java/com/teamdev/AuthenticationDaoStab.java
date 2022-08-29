package com.teamdev;

import com.google.common.base.Preconditions;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public class AuthenticationDaoStab implements AuthenticationDao {

    private final Map<RecordIdentifier<String>, AuthenticationRecord> authentications = new HashMap<>();

    public Map<RecordIdentifier<String>, AuthenticationRecord> authenticationsMap() {
        return Collections.unmodifiableMap(authentications);
    }

    @Override
    public AuthenticationRecord find(RecordIdentifier<String> id) throws DataAccessException {

        Preconditions.checkNotNull(id);

        if (!authentications.containsKey(id)) {
            throw new DataAccessException("Authentication not found.");
        }

        return authentications.get(id);
    }

    @Override
    public void delete(RecordIdentifier<String> id) throws DataAccessException {

        Preconditions.checkNotNull(id);

        if (!authentications.containsKey(id)) {
            throw new DataAccessException("Authentication not found.");
        }
        authentications.remove(id);
    }

    @Override
    public void create(AuthenticationRecord record) throws DataAccessException {

        Preconditions.checkNotNull(record);

        authentications.put(record.getId(), record);
    }

    @Override
    public void update(AuthenticationRecord record) throws DataAccessException {

        Preconditions.checkNotNull(record);

        if (!authentications.containsKey(record.getId())) {
            throw new DataAccessException("Authentication not found.");
        }

        authentications.put(record.getId(), record);

    }

}
