package com.teamdev.persistent.dao.file;

import com.google.common.flogger.FluentLogger;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.file.FileData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.user.UserRecord;

import javax.annotation.Nonnull;

/**
 * {@link FileDao} implementation which is intended to work with files meta context
 * in {@link InMemoryDatabase}.
 */
public class InMemoryFileDao implements FileDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryFileDao(InMemoryDatabase database) {
        this.database = database;
    }

    /**
     * Method to find a file meta context record in the {@link InMemoryDatabase} by id.
     *
     * @param id
     *         File meta context record identifier.
     * @return {@link UserRecord}.
     */
    @Override
    public FileRecord find(@Nonnull RecordIdentifier<String> id) throws DataAccessException {

        FileData fileData;

        try {
            fileData = database.fileTable()
                               .getFileById(id.getValue());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        FileRecord fileRecord = new FileRecord(new RecordIdentifier<>(fileData.id()),
                                               new RecordIdentifier<>(fileData.ownerId()),
                                               fileData.filePath());

        logger.atInfo()
              .log("[FILE FOUNDED] - path: %s", id.getValue());

        return fileRecord;
    }

    /**
     * Method to delete file meta context record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         file meta context record identifier.
     */
    @Override
    public void delete(@Nonnull RecordIdentifier<String> id) throws DataAccessException {

        try {
            database.fileTable()
                    .deleteFile(id.getValue());
        } catch (DatabaseException | DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[FILE DELETED] - path: %s", id.getValue());

    }

    /**
     * Method to create file meta context record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         file meta context record to create.
     */
    @Override
    public void create(@Nonnull FileRecord record) throws DataAccessException {

        FileData fileData = new FileData(record.getId()
                                               .getValue(),
                                         record.ownerId()
                                               .getValue(),
                                         record.filePath());

        try {
            database.fileTable()
                    .addFile(fileData);
        } catch (DatabaseException | DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[FILE CREATED] - path: %s", record.filePath());

    }

    /**
     * Method to update file meta context record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         file meta context record to update.
     */
    @Override
    public void update(@Nonnull FileRecord record) throws DataAccessException {

        FileData fileData = new FileData(record.getId()
                                               .getValue(),
                                         record.ownerId()
                                               .getValue(),
                                         record.filePath());

        try {
            database.fileTable()
                    .updateFile(fileData);
        } catch (DatabaseException | DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[FILE UPDATED] - path: %s", record.filePath());

    }
}
