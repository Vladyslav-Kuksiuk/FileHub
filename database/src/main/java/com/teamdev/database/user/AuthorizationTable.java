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

public class AuthorizationTable {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final Gson gson;
    private final File file = new File(
            InMemoryDatabase.DATABASE_FOLDER_PATH + "userAuthorizations.json");
    private Map<String, AuthorizationData> authorizations = new HashMap<>();

    public AuthorizationTable() {
        logger.atInfo()
              .log("User authorizations table Creating");

        gson = new Gson();
        Type mapType = new TypeToken<Map<String, AuthorizationData>>() {
        }.getType();

        try {

            if (!file.exists()) {
                file.createNewFile();

                try (Writer writer = Files.newBufferedWriter(file.toPath(), UTF_8)) {
                    writer.write(gson.toJson(authorizations));
                }

            }

            try (Reader reader = Files.newBufferedReader(file.toPath(), UTF_8)) {
                authorizations = gson.fromJson(reader, mapType);
            }

        } catch (IOException exception) {

            logger.atWarning()
                  .log("[DATABASE READING ERROR]");
        }
    }

    public AuthorizationData getAuthorizationByUserId(@NotNull String userId) throws
                                                                              DatabaseTransactionException {
        if (!authorizations.containsKey(userId)) {
            throw new DatabaseTransactionException(
                    "User authorization with this id doesn't exist.");
        }

        return authorizations.get(userId);

    }

    public void addUserAuthorization(@NotNull AuthorizationData authorization) throws
                                                                               DatabaseException {

        authorizations.put(authorization.getUserId(), authorization);

        updateDatabaseInFile();

    }

    private synchronized void updateDatabaseInFile() throws DatabaseException {

        try (Writer writer = Files.newBufferedWriter(file.toPath(), UTF_8)) {
            writer.write(gson.toJson(authorizations));

        } catch (IOException e) {
            logger.atWarning()
                  .log("[DATABASE SAVING CRASHED]");
            throw new DatabaseException("Database saving crashed.", e.getCause());
        }

    }

    /**
     * Clean all data about authorizations.
     *
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void clean() throws DatabaseException {
        authorizations = new HashMap<>();
        try {
            if (file.delete()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            throw new DatabaseException("Database cleaning crashed.");
        }
    }

}
