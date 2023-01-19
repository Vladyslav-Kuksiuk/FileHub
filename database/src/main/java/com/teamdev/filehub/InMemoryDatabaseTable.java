package com.teamdev.filehub;

import com.google.common.flogger.FluentLogger;
import com.google.gson.Gson;

import javax.annotation.Nonnull;
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

    private final Object locker = new Object();

    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);
    private final Map<I, D> tableMap = new HashMap<>();
    private ScheduledFuture<Boolean> fileWritingFuture = null;

    protected InMemoryDatabaseTable(@Nonnull String filePath,
                                    @Nonnull Class<D[]> dataArrayClass) {

        file = new File(filePath);

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
            throw new RuntimeException("Database table reading failed.");
        }

    }

    /**
     * Founds {@link Data} in {@code tableMap} by id.
     *
     * @param id
     *         {@link Data} identifier.
     * @return {@link Data}.
     */
    public Optional<D> findById(@Nonnull I id) {

        return Optional.ofNullable(tableMap().get(id));
    }

    /**
     * Adds {@link Data} to {@code tableMap}.
     *
     * @param data
     *         {@link Data} to add.
     */
    public void create(@Nonnull D data) {

        if (tableMap().containsKey(data.id())) {
            throw new RuntimeException("Data with this id already exists");
        }

        synchronized (locker) {

            tableMap().put(data.id(), data);

            updateTableInFile();

        }

    }

    /**
     * Deletes {@link Data} from {@code tableMap} by id.
     *
     * @param id
     *         {@link Data} identifier to delete.
     */
    public void delete(@Nonnull I id) {

        if (!tableMap().containsKey(id)) {
            throw new RuntimeException("Data with this id doesn't exist.");
        }

        synchronized (locker) {

            tableMap().remove(id);

            updateTableInFile();
        }
    }

    /**
     * Updates {@link Data} in {@code tableMap}.
     *
     * @param data
     *         {@link Data} to update.
     */
    public void update(@Nonnull D data) {

        if (!tableMap().containsKey(data.id())) {
            throw new RuntimeException("Data with this id doesn't exist.");
        }

        synchronized (locker) {

            tableMap().put(data.id(), data);

            updateTableInFile();
        }
    }

    /**
     * Save {@link Map} with {@link Data} in file as JSON.
     */
    protected void updateTableInFile() {

        Optional<ScheduledFuture<Boolean>> fileWritingFuture = Optional.ofNullable(
                this.fileWritingFuture);

        fileWritingFuture.ifPresent(future -> future.cancel(false));

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
                throw new RuntimeException("Database in file not accessed.");
            }
            return true;
        }, 100, TimeUnit.MILLISECONDS);

        this.fileWritingFuture = future;

    }

    /**
     * Clean all data in map and file.
     */
    public void clean() {
        tableMap.clear();
        try {
            if (file.delete()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            throw new RuntimeException("Database table cleaning failed.");
        }
    }

    protected Map<I, D> tableMap() {
        return tableMap;
    }
}
