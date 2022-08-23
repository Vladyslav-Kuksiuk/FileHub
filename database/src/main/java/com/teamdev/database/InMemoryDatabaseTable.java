package com.teamdev.database;

import com.google.common.flogger.FluentLogger;
import com.google.gson.Gson;

import javax.validation.constraints.NotNull;
import java.io.File;
import java.io.IOException;
import java.io.Reader;
import java.io.Writer;
import java.nio.file.Files;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Optional;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * A class that simulates a database table as {@link Map} and synchronizes it with a JSON file.
 *
 * @param <I>
 *         Data identifier type.
 * @param <D>
 *         Data type.
 */
public abstract class InMemoryDatabaseTable<I, D extends Data<I>> {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final Gson gson = new Gson();

    private final File file;

    private Map<I, D> tableMap = new HashMap<>();

    protected InMemoryDatabaseTable(@NotNull String fileName, Class<D[]> dataArrayClass) throws
                                                                                         DatabaseException {

        file = new File(InMemoryDatabase.DATABASE_FOLDER_PATH + fileName);

        try {

            if (!file.exists()) {
                file.createNewFile();
            }

            try (Reader reader = Files.newBufferedReader(file.toPath(), UTF_8)) {

                D[] dataArray = gson.fromJson(reader, dataArrayClass);
                Optional<D[]> optionalDataArray = Optional.ofNullable(dataArray);

                if (optionalDataArray.isPresent()) {
                    for (D data : dataArray) {
                        tableMap.put(data.id(), data);
                    }
                }
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

            writer.write("[");
            Iterator iterator = tableMap.values()
                                        .iterator();

            while (iterator.hasNext()) {
                writer.write(gson.toJson(iterator.next()));
                if (iterator.hasNext()) {
                    writer.write(",");
                }
            }

//            for (D data : tableMap().values()) {
//                writer.write(gson.toJson(data));
//            }
            writer.write("]");

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

    protected Map<I, D> tableMap() {
        return tableMap;
    }
}
