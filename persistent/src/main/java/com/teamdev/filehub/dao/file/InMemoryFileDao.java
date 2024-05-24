package com.teamdev.filehub.dao.file;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.user.UserRecord;
import com.teamdev.filehub.file.FileData;
import com.teamdev.filehub.file.FileTable;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * {@link FileDao} implementation which is intended to work with files meta context
 * in {@link InMemoryDatabase}.
 */
public class InMemoryFileDao implements FileDao {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileTable fileTable;

    public InMemoryFileDao(FileTable fileTable) {
        this.fileTable = fileTable;
    }

    private static FileRecord convertDataIntoRecord(FileData data) {
        return new FileRecord(new RecordId(data.id()),
                              new RecordId(data.folderId()),
                              new RecordId(data.ownerId()),
                              data.name(),
                              data.mimetype(),
                              data.size(),
                              data.archivedSize(),
                              data.extension());
    }

    private static FileData convertRecordIntoData(FileRecord record) {
        return new FileData(record.id()
                                  .value(),
                            record.folderId()
                                  .value(),
                            record.ownerId()
                                  .value(),
                            record.name(),
                            record.mimetype(),
                            record.size(),
                            record.archivedSize(),
                            record.extension());
    }

    /**
     * Method to find a file meta context record in the {@link InMemoryDatabase} by id.
     *
     * @param id
     *         File meta context record identifier.
     * @return {@link UserRecord}.
     */
    @Override
    public Optional<FileRecord> find(@Nonnull RecordId id) {

        Optional<FileData> optionalFileData = fileTable.findById(id.value());

        logger.atInfo()
              .log("[FILE FOUNDED] - id: %s", id.value());

        if (optionalFileData.isPresent()) {

            FileData fileData = optionalFileData.get();

            return Optional.of(convertDataIntoRecord(fileData));

        }

        return Optional.empty();
    }

    /**
     * Method to delete file meta context record in the {@link InMemoryDatabase}.
     *
     * @param id
     *         file meta context record identifier.
     */
    @Override
    public void delete(@Nonnull RecordId id) {
        fileTable.delete(id.value());

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
    public void create(@Nonnull FileRecord record) {

        fileTable.create(convertRecordIntoData(record));

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
    public void update(@Nonnull FileRecord record) {

        fileTable.update(convertRecordIntoData(record));

        logger.atInfo()
              .log("[FILE UPDATED] - id: %s", record.id()
                                                    .value());

    }

    @Override
    public List<FileRecord> getByFolderId(RecordId folderId) {
        return fileTable.getByFolderId(folderId.value())
                .stream()
                .map(InMemoryFileDao::convertDataIntoRecord)
                .collect(Collectors.toList());
    }

    @Override
    public List<FileRecord> getByFolderIdAndNamePart(RecordId folderId, String namePart) {
        return fileTable.getByFolderIdAndNamePart(folderId.value(), namePart)
                .stream()
                .map(InMemoryFileDao::convertDataIntoRecord)
                .collect(Collectors.toList());
    }

    @Override
    public FilesStatistics getFilesStatistics() {
        return null;
    }
}
