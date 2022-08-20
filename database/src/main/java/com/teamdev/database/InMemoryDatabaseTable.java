package com.teamdev.database;

import com.google.common.flogger.FluentLogger;
import com.google.common.reflect.TypeToken;
import com.google.gson.Gson;

import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * A class that simulates a database table as {@link Map} and synchronizes it with a JSON file.
 *
 * @param <K>
 *         Data identifier type.
 * @param <V>
 *         Data type.
 */
public abstract class InMemoryDatabaseTable<K, V> {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final Gson gson = new Gson();

    private final File file;

    private Map<K, V> tableMap;

    protected InMemoryDatabaseTable(String fileName) throws DatabaseException {

        file = new File(InMemoryDatabase.DATABASE_FOLDER_PATH + fileName);

        Type mapType = new TypeToken<Map<K, V>>() {
        }.getType();

        try {

            if (!file.exists()) {
                file.createNewFile();
            }

            try (Reader reader = Files.newBufferedReader(file.toPath(), UTF_8)) {
                Optional<Map<K, V>> optionalTableMap = Optional.ofNullable(
                        gson.fromJson(reader, mapType));
                tableMap = optionalTableMap.orElse(new HashMap<>());
            }

        } catch (IOException exception) {
            logger.atWarning()
                  .log("[DATABASE TABLE READING FAILED]");
            throw new DatabaseException("Database table reading failed.");
        }

    }

    /**
     * Save {@link Map} in file.
     *
     * @throws DatabaseException
     *         If database connection not working.
     */
    protected synchronized void updateTableInFile() throws DatabaseException {

        try (Writer writer = Files.newBufferedWriter(file.toPath(), UTF_8)) {
            writer.write(gson.toJson(tableMap));

        } catch (IOException e) {
            logger.atWarning()
                  .log("[DATABASE TABLE SAVING CRASHED]");
            throw new DatabaseException("Database table saving crashed.", e.getCause());
        }

    }

    /**
     * Clean all data in map and file.
     *
     * @throws DatabaseException
     *         If database connection not working.
     */
    public void clean() throws DatabaseException {
        tableMap.clear();
        try {
            if (file.delete()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            throw new DatabaseException("Database table cleaning failed.");
        }
    }

    protected Map<K, V> tableMap() {
        return tableMap;
    }
}
