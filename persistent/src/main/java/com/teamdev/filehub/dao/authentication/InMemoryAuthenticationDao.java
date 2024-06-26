package com.teamdev.filehub.dao.authentication;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.authentication.AuthenticationData;
import com.teamdev.filehub.authentication.AuthenticationTable;
import com.teamdev.filehub.dao.RecordId;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;
import java.util.Optional;

/**
 * {@link AuthenticationDao} implementation which is intended to work with authentications
 * in {@link InMemoryDatabase}.
 */
public class InMemoryAuthenticationDao implements AuthenticationDao {

    private final AuthenticationTable authTable;

    public InMemoryAuthenticationDao(@Nonnull AuthenticationTable authTable) {
        Preconditions.checkNotNull(authTable);
        this.authTable = authTable;
    }

    /**
     * Method to find user authentication record in the {@link InMemoryDatabase} by id.
     *
     * @param authId
     *         Authentication identifier.
     * @return {@link AuthenticationRecord}.
     */
    @Override
    public Optional<AuthenticationRecord> find(@Nonnull RecordId authId) {
        Preconditions.checkNotNull(authId);

        Optional<AuthenticationData> optionalAuthData = authTable.findById(authId.value());

        if (optionalAuthData.isPresent()) {

            AuthenticationData authData = optionalAuthData.get();

            return Optional.of(new AuthenticationRecord(new RecordId(authData.id()),
                                                        authData.authenticationToken(),
                                                        LocalDateTime.parse(authData.expireTime()),
                                                        new RecordId(authData.userId())));
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
    public void delete(@Nonnull RecordId userId) {
        authTable.delete(userId.value());

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
                                                               .toString(),
                                                         record.userId()
                                                               .value());

        authTable.create(data);

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
                                                               .toString(),
                                                         record.userId()
                                                               .value());

        authTable.update(data);

    }

    @Override
    public Optional<AuthenticationRecord> findByToken(@Nonnull String token) {
        Preconditions.checkNotNull(token);

        Optional<AuthenticationData> optionalAuthData = authTable.findByToken(token);

        if (optionalAuthData.isPresent()) {

            AuthenticationData authData = optionalAuthData.get();

            return Optional.of(new AuthenticationRecord(new RecordId(authData.id()),
                                                        authData.authenticationToken(),
                                                        LocalDateTime.parse(
                                                                authData.expireTime()),
                                                        new RecordId(authData.userId())));
        }

        return Optional.empty();
    }
}
