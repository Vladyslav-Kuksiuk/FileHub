package com.teamdev.database.user;

import com.google.common.flogger.FluentLogger;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
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
    private final Gson gson;
    private final File file = new File(InMemoryDatabase.DATABASE_FOLDER_PATH + "users.json");
    private Map<String, UserData> users = new HashMap<>();

    public UserTable() {

        logger.atInfo()
              .log("User Table Creating");

        gson = new Gson();
        Type mapType = new TypeToken<Map<String, UserData>>() {
        }.getType();

        try {

            if (!file.exists()) {
                file.createNewFile();

                try (Writer writer = Files.newBufferedWriter(file.toPath(), UTF_8)) {
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

    /**
     * Method to get data about user by id.
     *
     * @param id
     *         User id.
     * @return {@link UserData} by id.
     * @throws DatabaseTransactionException
     *         if user doesn't exist.
     */
    public UserData getUserById(@NotNull String id) throws DatabaseTransactionException {

        if (!users.containsKey(id)) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        return users.get(id);
    }

    /**
     * Method to add data about new user.
     *
     * @param user
     *         {@link UserData}.
     * @throws DatabaseException
     *         if database connection not working.
     * @throws DatabaseTransactionException
     *         if user already exists.
     */
    public void addUser(@NotNull UserData user) throws DatabaseException,
                                                       DatabaseTransactionException {

        if (users.containsKey(user.id())) {
            throw new DatabaseTransactionException("User with this login already exists.");
        }

        users.put(user.id(), user);

        updateDatabaseInFile();

    }

    /**
     * Method to delete data about user by id.
     *
     * @param id
     *         User id.
     * @throws DatabaseTransactionException
     *         if user doesn't exist.
     * @throws DatabaseException
     *         if database connection not working.
     */
    public void deleteUser(@NotNull String id) throws DatabaseTransactionException,
                                                      DatabaseException {
        if (!users.containsKey(id)) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        users.remove(id);

        updateDatabaseInFile();

    }

    /**
     * Method to update data about user.
     *
     * @param user
     *         {@link UserData}.
     * @throws DatabaseTransactionException
     *         if user already exists.
     * @throws DatabaseException
     *         if database connection not working.
     */
    public void updateUser(@NotNull UserData user) throws DatabaseTransactionException,
                                                          DatabaseException {
        if (!users.containsKey(user.id())) {
            throw new DatabaseTransactionException("User with this id doesn't exist.");
        }

        users.put(user.id(), user);

        updateDatabaseInFile();

    }

    private synchronized void updateDatabaseInFile() throws DatabaseException {

        try (Writer writer = Files.newBufferedWriter(file.toPath(), UTF_8)) {
            writer.write(gson.toJson(users));

        } catch (IOException e) {
            logger.atWarning()
                  .log("[DATABASE SAVING CRASHED]");
            throw new DatabaseException("Database saving crashed.", e.getCause());
        }

    }

    /**
     * Clean all data about users.
     *
     * @throws DatabaseException
     *         if database connection not working.
     */
    public void clean() throws DatabaseException {
        users = new HashMap<>();
        try {
            if (file.delete()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            throw new DatabaseException("Database cleaning crashed.");
        }
    }

}
