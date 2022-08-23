package com.teamdev.persistent.dao.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.AuthenticationData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * {@link AuthenticationDao} implementation which is intended to work with authentications
 * in {@link InMemoryDatabase}.
 */
public class InMemoryAuthenticationDao implements AuthenticationDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryAuthenticationDao(InMemoryDatabase database) {
        Preconditions.checkNotNull(database);
        this.database = database;
    }

    /**
     * Method to find user authentication record in the {@link InMemoryDatabase} by id.
     *
     * @param userId
     *         Authentication user identifier.
     * @return {@link AuthenticationRecord}.
     * @throws DataAccessException
     *         If user authentication not found.
     */
    @Override
    public AuthenticationRecord find(@NotNull RecordIdentifier<String> userId) throws
                                                                               DataAccessException {
        Preconditions.checkNotNull(userId);

        AuthenticationData authenticationData;

        try {
            authenticationData = database.authenticationTable()
                                         .getAuthorizationByUserId(userId.getValue());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        AuthenticationRecord authenticationRecord =
                new AuthenticationRecord(new RecordIdentifier<>(authenticationData.id()),
                                         authenticationData.authenticationToken(),
                                         LocalDateTime.parse(authenticationData.expireTime()));

        logger.atInfo()
              .log("[AUTHENTICATION FOUND] - login: %s", authenticationRecord.getId()
                                                                             .getValue());

        return authenticationRecord;
    }

    /**
     * Method to delete user authentication record in the {@link InMemoryDatabase}.
     *
     * @param userId
     *         Authenticated user identifier.
     * @throws DataAccessException
     *         If user authentication not found.
     */
    @Override
    public void delete(@NotNull RecordIdentifier<String> userId) throws DataAccessException {

        try {
            database.authenticationTable()
                    .deleteAuthorization(userId.getValue());
        } catch (DatabaseTransactionException | DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

    }

    /**
     * Method to create user authentication record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         {@link AuthenticationRecord}.
     */
    @Override
    public void create(@NotNull AuthenticationRecord record) throws DataAccessException {

        AuthenticationData data = new AuthenticationData(record.getId()
                                                               .getValue(),
                                                         record.authenticationToken(),
                                                         record.expireTime()
                                                               .toString());

        try {
            database.authenticationTable()
                    .addAuthorization(data);
        } catch (DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

    }

    /**
     * Method to update user authentication in the {@link InMemoryDatabase}.
     *
     * @param record
     *         {@link AuthenticationRecord}.
     */
    @Override
    public void update(@NotNull AuthenticationRecord record) throws DataAccessException {

        AuthenticationData data = new AuthenticationData(record.getId()
                                                               .getValue(),
                                                         record.authenticationToken(),
                                                         record.expireTime()
                                                               .toString());

        try {
            database.authenticationTable()
                    .addAuthorization(data);
        } catch (DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

    }
}
