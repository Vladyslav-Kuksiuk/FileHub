package com.teamdev.persistent.dao.user;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.database.InMemoryDatabase;
import com.teamdev.persistent.database.user.UserData;

import javax.validation.constraints.NotNull;

/**
 * {@link UserDao} implementation which is intended to work with user
 * in {@link InMemoryDatabase}.
 */
public class InMemoryUserDao implements UserDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryUserDao(@NotNull InMemoryDatabase database) {
        this.database = database;
    }

    /**
     * Method to find a record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         Record identifier.
     * @return
     */
    @Override
    public UserRecord find(@NotNull RecordIdentifier<String> id) {

        UserData userData = database.userTable()
                                    .getUser(id.getId());

        UserRecord userRecord = new UserRecord(new RecordIdentifier<>(userData.getLogin()),
                                               userData.getLogin(),
                                               userData.getPassword(),
                                               userData.getEmail());

        logger.atInfo()
              .log("[USER FOUND] - login: %s", userData.getLogin());

        return userRecord;
    }

    /**
     * Method to delete a record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         Record identifier.
     */
    @Override
    public void delete(@NotNull RecordIdentifier<String> id) {

        database.userTable()
                .deleteUser(id.getId());

        logger.atInfo()
              .log("[USER DELETED] - id: %s", id.getId());

    }

    /**
     * Method to create a record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         Record to create.
     */
    @Override
    public void create(@NotNull UserRecord record) {

        UserData userData = new UserData(record.getLogin(),
                                         record.getPassword(),
                                         record.getEmail());

        database.userTable()
                .addUser(userData);

        logger.atInfo()
              .log("[USER CREATED] - login: %s", record.getLogin());
    }

    /**
     * Method to create a record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         Record to update.
     */
    @Override
    public void update(@NotNull UserRecord record) {

        UserData userData = new UserData(record.getLogin(),
                                         record.getPassword(),
                                         record.getEmail());

        database.userTable()
                .updateUser(userData);

        logger.atInfo()
              .log("[USER UPDATED] - login: %s", record.getLogin());

    }
}
