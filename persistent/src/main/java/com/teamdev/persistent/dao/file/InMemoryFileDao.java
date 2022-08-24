package com.teamdev.persistent.dao.file;

import com.google.common.flogger.FluentLogger;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.DatabaseTransactionException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.database.file.FileData;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;

import javax.annotation.Nonnull;

public class InMemoryFileDao implements FileDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final InMemoryDatabase database;

    public InMemoryFileDao(InMemoryDatabase database) {
        this.database = database;
    }

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
