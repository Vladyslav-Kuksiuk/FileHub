package com.teamdev.persistent.dao.user;

import com.google.common.flogger.FluentLogger;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.user.UserData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;

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
    public UserRecord find(@Nonnull RecordIdentifier<String> id) throws DataAccessException {

        UserData userData;

        try {
            userData = database.userTable()
                               .getUserById(id.getValue());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        UserRecord userRecord = new UserRecord(new RecordIdentifier<>(userData.id()),
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
    public void delete(@Nonnull RecordIdentifier<String> id) throws DataAccessException {

        try {
            database.userTable()
                    .deleteUser(id.getValue());
        } catch (DatabaseTransactionException | DatabaseException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[USER DELETED] - id: %s", id.getValue());

    }

    /**
     * Method to create user record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         User record to create.
     */
    @Override
    public void create(@Nonnull UserRecord record) throws DataAccessException {

        UserData userData = new UserData(record.getId()
                                               .getValue(),
                                         record.login(),
                                         record.password(),
                                         record.email());

        try {
            database.userTable()
                    .addUser(userData);
        } catch (DatabaseTransactionException | DatabaseException exception) {
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

        UserData userData = new UserData(record.getId()
                                               .getValue(),
                                         record.login(),
                                         record.password(),
                                         record.email());
        try {
            database.userTable()
                    .updateUser(userData);
        } catch (DatabaseTransactionException | DatabaseException exception) {
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

        UserRecord userRecord = new UserRecord(new RecordIdentifier<>(userData.id()),
                                               userData.login(),
                                               userData.password(),
                                               userData.email());

        return userRecord;
    }
}
