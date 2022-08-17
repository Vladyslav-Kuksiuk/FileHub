package com.teamdev.persistent.dao.user;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.database.InMemoryDatabase;
import com.teamdev.persistent.database.user.UserData;

import javax.validation.constraints.NotNull;

public class InMemoryUserDao implements UserDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryUserDao(@NotNull InMemoryDatabase database) {
        this.database = database;
    }

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

    @Override
    public void delete(@NotNull RecordIdentifier<String> id) {

        database.userTable()
                .deleteUser(id.getId());

        logger.atInfo()
              .log("[USER DELETED] - id: %s", id.getId());

    }

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
