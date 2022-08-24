package com.teamdev.database.file;

import com.google.common.flogger.FluentLogger;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabaseTable;

import javax.annotation.Nonnull;

/**
 * {@link InMemoryDatabaseTable} implementation to store {@link FileData}.
 */
public class FileTable extends InMemoryDatabaseTable<String, FileData> {

    private static final String FILE_NAME = "files.json";
    private final Object locker = new Object();
    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    public FileTable() throws
                       DatabaseException {
        super(FILE_NAME, FileData[].class);
    }

    public FileData getFileById(@Nonnull String id) throws DatabaseTransactionException {

        if (!tableMap().containsKey(id)) {
            throw new DatabaseTransactionException("File with this id not found.");
        }

        return tableMap().get(id);
    }

    public void addFile(@Nonnull FileData fileData) throws DatabaseException,
                                                           DatabaseTransactionException {

        synchronized (locker) {

            if (tableMap().containsKey(fileData.id())) {
                throw new DatabaseTransactionException("File with this path already exists");
            }

            tableMap().put(fileData.id(), fileData);

            updateTableInFile();

        }

    }

    public void deleteFile(@Nonnull String id) throws DatabaseException,
                                                      DatabaseTransactionException {

        synchronized (locker) {
            if (!tableMap().containsKey(id)) {
                throw new DatabaseTransactionException("File with this path doesn't exist.");
            }

            tableMap().remove(id);

            updateTableInFile();
        }
    }

    public void updateFile(@Nonnull FileData file) throws DatabaseTransactionException,
                                                          DatabaseException {
        synchronized (locker) {
            if (!tableMap().containsKey(file.id())) {
                throw new DatabaseTransactionException("File with this path doesn't exist.");
            }

            tableMap().put(file.id(), file);

            updateTableInFile();
        }
    }

}
