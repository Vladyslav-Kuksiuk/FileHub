package com.teamdev.filehub.dao.authentication;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.authentication.AuthenticationData;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * {@link AuthenticationDao} implementation which is intended to work with authentications
 * in {@link InMemoryDatabase}.
 */
public class InMemoryAuthenticationDao implements AuthenticationDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryAuthenticationDao(@Nonnull InMemoryDatabase database) {
        Preconditions.checkNotNull(database);
        this.database = database;
    }

    /**
     * Method to find user authentication record in the {@link InMemoryDatabase} by id.
     *
     * @param userId
     *         Authentication user identifier.
     * @return {@link AuthenticationRecord}.
     */
    @Override
    public Optional<AuthenticationRecord> find(@Nonnull RecordId<String> userId) {
        Preconditions.checkNotNull(userId);

        var optionalAuthData = database.authenticationTable()
                                       .findByUserId(userId.value());

        if (optionalAuthData.isPresent()) {

            var authenticationData = optionalAuthData.get();

            return Optional.of(new AuthenticationRecord(new RecordId<>(authenticationData.id()),
                                                        authenticationData.authenticationToken(),
                                                        LocalDateTime.parse(
                                                                authenticationData.expireTime())));
        }

        return Optional.empty();
    }

    /**
     * Method to delete user authentication record in the {@link InMemoryDatabase}.
     *
     * @param userId
     *         Authenticated user identifier.
     */
    @Override
    public void delete(@Nonnull RecordId<String> userId) {
        database.authenticationTable()
                .deleteData(userId.value());

    }

    /**
     * Method to create user authentication record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         {@link AuthenticationRecord}.
     */
    @Override
    public void create(@Nonnull AuthenticationRecord record) {

        AuthenticationData data = new AuthenticationData(record.id()
                                                               .value(),
                                                         record.authenticationToken(),
                                                         record.expireTime()
                                                               .toString());

        database.authenticationTable()
                .addData(data);

    }

    /**
     * Method to update user authentication in the {@link InMemoryDatabase}.
     *
     * @param record
     *         {@link AuthenticationRecord}.
     */
    @Override
    public void update(@Nonnull AuthenticationRecord record) {

        AuthenticationData data = new AuthenticationData(record.id()
                                                               .value(),
                                                         record.authenticationToken(),
                                                         record.expireTime()
                                                               .toString());

        database.authenticationTable()
                .addData(data);

    }
}
