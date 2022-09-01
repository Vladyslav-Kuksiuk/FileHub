package com.teamdev.filehub.dao.user;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DatabaseTransactionException;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.DataAccessException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.user.UserData;

import javax.annotation.Nonnull;

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
    public UserRecord find(@Nonnull RecordId<String> id) throws DataAccessException {

        UserData userData;

        try {
            userData = database.userTable()
                               .getDataById(id.value());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        UserRecord userRecord = new UserRecord(new RecordId<>(userData.id()),
                                               userData.login(),
                                               userData.password(),
                                               userData.email());

        logger.atInfo()
              .log("[USER FOUND] - login: %s", userData.login());

        return userRecord;
    }

    /**
     * Method to delete user record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         User record identifier.
     */
    @Override
    public void delete(@Nonnull RecordId<String> id) throws DataAccessException {

        try {
            database.userTable()
                    .deleteData(id.value());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

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
    public void create(@Nonnull UserRecord record) throws DataAccessException {

        UserData userData = new UserData(record.id()
                                               .value(),
                                         record.login(),
                                         record.password(),
                                         record.email());

        try {
            database.userTable()
                    .addData(userData);
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

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
    public void update(@Nonnull UserRecord record) throws DataAccessException {

        UserData userData = new UserData(record.id()
                                               .value(),
                                         record.login(),
                                         record.password(),
                                         record.email());
        try {
            database.userTable()
                    .updateData(userData);
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

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
    public UserRecord findByLogin(@Nonnull String login) throws DataAccessException {

        UserData userData;

        try {
            userData = database.userTable()
                               .getUserByLogin(login);
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        UserRecord userRecord = new UserRecord(new RecordId<>(userData.id()),
                                               userData.login(),
                                               userData.password(),
                                               userData.email());

        return userRecord;
    }
}
