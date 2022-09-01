package com.teamdev.filehub.dao.user;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.user.UserData;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link UserDao} implementation which is intended to work with user
 * in {@link InMemoryDatabase}.
 */
public class InMemoryUserDao implements UserDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryUserDao(@Nonnull InMemoryDatabase database) {
        this.database = database;
    }

    /**
     * Method to find a user record in the {@link InMemoryDatabase} by id.
     *
     * @param id
     *         User record identifier.
     * @return {@link UserRecord}.
     */
    @Override
    public Optional<UserRecord> find(@Nonnull RecordId<String> id) {

        Optional<UserData> optionalUserData = database.userTable()
                                                      .getDataById(id.value());

        if (optionalUserData.isPresent()) {

            UserData userData = optionalUserData.get();

            return Optional.of(new UserRecord(new RecordId<>(userData.id()),
                                              userData.login(),
                                              userData.password(),
                                              userData.email()));

        }

        return Optional.empty();
    }

    /**
     * Method to delete user record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         User record identifier.
     */
    @Override
    public void delete(@Nonnull RecordId<String> id) {

        database.userTable()
                .deleteData(id.value());

        logger.atInfo()
              .log("[USER DELETED] - id: %s", id.value());

    }

    /**
     * Method to create user record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         User record to create.
     */
    @Override
    public void create(@Nonnull UserRecord record) {

        UserData userData = new UserData(record.id()
                                               .value(),
                                         record.login(),
                                         record.password(),
                                         record.email());

        database.userTable()
                .addData(userData);

        logger.atInfo()
              .log("[USER CREATED] - login: %s", record.login());
    }

    /**
     * Method to update user record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         User record to update.
     */
    @Override
    public void update(@Nonnull UserRecord record) {

        UserData userData = new UserData(record.id()
                                               .value(),
                                         record.login(),
                                         record.password(),
                                         record.email());

        database.userTable()
                .updateData(userData);

        logger.atInfo()
              .log("[USER UPDATED] - login: %s", record.login());

    }

    /**
     * Method to find a user record in the {@link InMemoryDatabase} by login.
     *
     * @param login
     *         User login.
     * @return {@link UserRecord}.
     */
    @Override
    public Optional<UserRecord> findByLogin(@Nonnull String login) {

        Optional<UserData> optionalUserData = database.userTable()
                                                      .getUserByLogin(login);

        if (optionalUserData.isPresent()) {

            UserData userData = optionalUserData.get();

            return Optional.of(new UserRecord(new RecordId<>(userData.id()),
                                              userData.login(),
                                              userData.password(),
                                              userData.email()));
        }

        return Optional.empty();
    }
}
