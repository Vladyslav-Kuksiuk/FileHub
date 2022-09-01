package com.teamdev.filehub.dao.file;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DatabaseTransactionException;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.DataAccessException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.file.FileData;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.stream.Collectors;

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
    public FileRecord find(@Nonnull RecordId<String> id) throws DataAccessException {

        FileData fileData;

        try {
            fileData = database.fileTable()
                               .getDataById(id.value());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        FileRecord fileRecord = new FileRecord(new RecordId<>(fileData.id()),
                                               new RecordId<>(fileData.folderId()),
                                               new RecordId<>(fileData.ownerId()),
                                               fileData.name(),
                                               fileData.extension());

        logger.atInfo()
              .log("[FILE FOUNDED] - id: %s", id.value());

        return fileRecord;
    }

    /**
     * Method to delete file meta context record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         file meta context record identifier.
     */
    @Override
    public void delete(@Nonnull RecordId<String> id) throws DataAccessException {

        try {
            database.fileTable()
                    .deleteData(id.value());
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[FILE DELETED] - id: %s", id.value());

    }

    /**
     * Method to create file meta context record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         file meta context record to create.
     */
    @Override
    public void create(@Nonnull FileRecord record) throws DataAccessException {

        FileData fileData = new FileData(record.id()
                                               .value(),
                                         record.folderId()
                                               .value(),
                                         record.ownerId()
                                               .value(),
                                         record.name(),
                                         record.extension());

        try {
            database.fileTable()
                    .addData(fileData);
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[FILE CREATED] - id: %s", record.id()
                                                    .value());

    }

    /**
     * Method to update file meta context record in the {@link InMemoryDatabase}.
     *
     * @param record
     *         file meta context record to update.
     */
    @Override
    public void update(@Nonnull FileRecord record) throws DataAccessException {

        FileData fileData = new FileData(record.id()
                                               .value(),
                                         record.folderId()
                                               .value(),
                                         record.ownerId()
                                               .value(),
                                         record.name(),
                                         record.extension());

        try {
            database.fileTable()
                    .updateData(fileData);
        } catch (DatabaseTransactionException exception) {
            throw new DataAccessException(exception.getMessage(), exception.getCause());
        }

        logger.atInfo()
              .log("[FILE UPDATED] - id: %s", record.id()
                                                    .value());

    }

    @Override
    public List<FileRecord> getFilesInFolder(RecordId<String> folderId) {
        return database.fileTable()
                       .selectWithSameFolderId(folderId.value())
                       .stream()
                       .map(data -> new FileRecord(new RecordId<>(data.id()),
                                                   new RecordId<>(data.folderId()),
                                                   new RecordId<>(data.ownerId()),
                                                   data.name(),
                                                   data.extension()))
                       .collect(Collectors.toList());
    }
}
