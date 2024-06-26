package com.teamdev.filehub.dao.user;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.user.UserData;
import com.teamdev.filehub.user.UserTable;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link UserDao} implementation which is intended to work with user
 * in {@link InMemoryDatabase}.
 */
public class InMemoryUserDao implements UserDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserTable userTable;

    public InMemoryUserDao(@Nonnull UserTable userTable) {
        this.userTable = Preconditions.checkNotNull(userTable);
    }

    /**
     * Method to find a user record in the {@link InMemoryDatabase} by id.
     *
     * @param id User record identifier.
     * @return {@link UserRecord}.
     */
    @Override
    public Optional<UserRecord> find(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        Optional<UserData> optionalUserData = userTable
                .findById(id.value());

        if (optionalUserData.isPresent()) {

            UserData userData = optionalUserData.get();

            return Optional.of(new UserRecord(new RecordId(userData.id()),
                    userData.login(),
                    userData.password(),
                    userData.isEmailConfirmed(),
                    userData.emailHash(),
                    userData.isBanned()));

        }

        return Optional.empty();
    }

    /**
     * Method to delete user record in the {@link InMemoryDatabase}.
     *
     * @param id User record identifier.
     */
    @Override
    public void delete(@Nonnull RecordId id) {
        Preconditions.checkNotNull(id);

        userTable.delete(id.value());

        logger.atInfo()
                .log("[USER DELETED] - id: %s", id.value());

    }

    /**
     * Method to create user record in the {@link InMemoryDatabase}.
     *
     * @param record User record to create.
     */
    @Override
    public void create(@Nonnull UserRecord record) {
        Preconditions.checkNotNull(record);

        UserData userData = new UserData(record.id()
                .value(),
                record.login(),
                record.password(),
                record.isEmailConfirmed(),
                record.emailHash(),
                record.isBanned());

        userTable.create(userData);

        logger.atInfo()
                .log("[USER CREATED] - login: %s", record.login());
    }

    /**
     * Method to update user record in the {@link InMemoryDatabase}.
     *
     * @param record User record to update.
     */
    @Override
    public void update(@Nonnull UserRecord record) {
        Preconditions.checkNotNull(record);

        UserData userData = new UserData(record.id()
                .value(),
                record.login(),
                record.password(),
                record.isEmailConfirmed(),
                record.emailHash(), record.isBanned());

        userTable.update(userData);

        logger.atInfo()
                .log("[USER UPDATED] - login: %s", record.login());

    }

    /**
     * Method to find a user record in the {@link InMemoryDatabase} by login.
     *
     * @param login User login.
     * @return {@link UserRecord}.
     */
    @Override
    public Optional<UserRecord> findByLogin(@Nonnull String login) {
        Preconditions.checkNotNull(login);

        Optional<UserData> optionalUserData = userTable.getUserByLogin(login);

        if (optionalUserData.isPresent()) {

            UserData userData = optionalUserData.get();

            return Optional.of(new UserRecord(new RecordId(userData.id()),
                    userData.login(),
                    userData.password(),
                    userData.isEmailConfirmed(),
                    userData.emailHash(),
                    userData.isBanned()));
        }

        return Optional.empty();
    }

    @Override
    public Optional<UserRecord> findByEmailHash(@Nonnull String emailHash) {
        Preconditions.checkNotNull(emailHash);

        Optional<UserData> optionalUserData = userTable.getUserByEmailHash(emailHash);

        if (optionalUserData.isPresent()) {

            UserData userData = optionalUserData.get();

            return Optional.of(new UserRecord(new RecordId(userData.id()),
                    userData.login(),
                    userData.password(),
                    userData.isEmailConfirmed(),
                    userData.emailHash(),
                    userData.isBanned()));
        }

        return Optional.empty();
    }
}
