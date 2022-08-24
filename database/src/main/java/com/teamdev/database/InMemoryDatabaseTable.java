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
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.ScheduledFuture;
import java.util.concurrent.TimeUnit;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * A class that store {@link Data} implementation in {@link Map} and
 * have methods to synchronize it with a JSON file.
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

    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

    private ScheduledFuture<Boolean> fileWritingFuture = null;

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
    protected void updateTableInFile() throws DatabaseException {

        Optional<ScheduledFuture<Boolean>> fileWritingFuture = Optional.ofNullable(
                this.fileWritingFuture);

        fileWritingFuture.ifPresent(future -> future.cancel(true));

        var future = executor.schedule(() -> {

            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException("Thread sleep failed.");
            }

            try (Writer writer = Files.newBufferedWriter(file.toPath(), UTF_8)) {

                writer.write("[");
                Iterator<D> iterator = tableMap.values()
                                               .iterator();

                while (iterator.hasNext()) {
                    writer.write(gson.toJson(iterator.next()));
                    if (iterator.hasNext()) {
                        writer.write(",");
                    }
                }

                writer.write("]");

                logger.atInfo()
                      .log("[DATABASE TABLE UPDATED IN FILE] - table: %s", this.getClass()
                                                                               .getSimpleName());

            } catch (IOException e) {
                logger.atWarning()
                      .log("[DATABASE TABLE SAVING CRASHED]");
                throw new DatabaseException("Database table saving crashed.", e.getCause());
            }
            return true;
        }, 500, TimeUnit.MILLISECONDS);

        this.fileWritingFuture = future;

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
