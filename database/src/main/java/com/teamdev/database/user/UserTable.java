package com.teamdev.database.user;

import com.google.common.flogger.FluentLogger;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.Reader;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * Database table imitation to store {@link UserData}.
 */
public class UserTable {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private Map<String, UserData> users = new HashMap<>();
    private final Gson gson;
    private final File file = new File("users.json");

    public UserTable() {

        logger.atInfo()
              .log("User Table Creating");

        gson = new Gson();
        Type mapType = new TypeToken<Map<String, UserData>>() {
        }.getType();

        try {

            if (!file.exists()) {
                file.createNewFile();

                try (FileWriter writer = new FileWriter(file)) {
                    writer.write(gson.toJson(users));
                }

            }

            try (Reader reader = Files.newBufferedReader(file.toPath(), UTF_8)) {
                users = gson.fromJson(reader, mapType);
            }

        } catch (IOException exception) {

            logger.atWarning()
                  .log("[DATABASE READING ERROR]");
        }

    }

    public UserData getUser(@NotNull String id) throws DatabaseTransactionException {

        if (!users.containsKey(id)) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        return users.get(id);
    }

    public void addUser(@NotNull UserData user) throws DatabaseException,
                                                       DatabaseTransactionException {

        if (users.containsKey(user.getLogin())) {
            throw new DatabaseTransactionException("User with this login already exists.");
        }

        users.put(user.getLogin(), user);

        updateDatabaseInFile();

    }

    public void deleteUser(@NotNull String id) throws DatabaseTransactionException,
                                                      DatabaseException {
        if (!users.containsKey(id)) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        users.remove(id);

        updateDatabaseInFile();

    }

    public void updateUser(@NotNull UserData user) throws DatabaseTransactionException,
                                                          DatabaseException {
        if (!users.containsKey(user.getLogin())) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        users.put(user.getLogin(), user);

        updateDatabaseInFile();

    }

    private void updateDatabaseInFile() throws DatabaseException {

        try (FileWriter writer = new FileWriter(file, false)) {
            writer.write(gson.toJson(users));

        } catch (IOException e) {
            logger.atWarning()
                  .log("[DATABASE SAVING CRASHED]");
            throw new DatabaseException("Database saving crashed.", e.getCause());
        }

    }

    public void clean() throws DatabaseException {
        users = new HashMap<>();
        try {
            if(file.delete()){
                file.createNewFile();
            }
        } catch (IOException e) {
            throw new DatabaseException("Database cleaning crashed.");
        }
    }

}
