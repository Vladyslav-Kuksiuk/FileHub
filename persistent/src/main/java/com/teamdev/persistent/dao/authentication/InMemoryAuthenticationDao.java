package com.teamdev.persistent.dao.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.AuthenticationData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;

import java.util.Date;

public class InMemoryAuthenticationDao implements AuthenticationDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryAuthenticationDao(InMemoryDatabase database) {
        Preconditions.checkNotNull(database);
        this.database = database;
    }

    @Override
    public AuthenticationRecord find(RecordIdentifier<String> userId) throws DataAccessException {
        Preconditions.checkNotNull(userId);

        AuthenticationData authenticationData;

        try {
            authenticationData = database.authenticationTable()
                                         .getAuthorizationByUserId(userId.getValue());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        AuthenticationRecord authenticationRecord =
                new AuthenticationRecord(new RecordIdentifier<>(authenticationData.userId()),
                                         authenticationData.authenticationToken(),
                                         new Date(authenticationData.authorizationTime()));

        return authenticationRecord;
    }

    @Override
    public void delete(RecordIdentifier<String> id) throws DataAccessException {

        try {
            database.authenticationTable()
                    .deleteAuthorization(id.getValue());
        } catch (DatabaseTransactionException | DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

    }

    @Override
    public void create(AuthenticationRecord record) throws DataAccessException {

        AuthenticationData data = new AuthenticationData(record.getId()
                                                               .getValue(),
                                                         record.authenticationToken(),
                                                         record.authorizationTime()
                                                               .getTime());

        try {
            database.authenticationTable()
                    .addAuthorization(data);
        } catch (DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

    }

    @Override
    public void update(AuthenticationRecord record) throws DataAccessException {

        AuthenticationData data = new AuthenticationData(record.getId()
                                                               .getValue(),
                                                         record.authenticationToken(),
                                                         record.authorizationTime()
                                                               .getTime());

        try {
            database.authenticationTable()
                    .addAuthorization(data);
        } catch (DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

    }
}
