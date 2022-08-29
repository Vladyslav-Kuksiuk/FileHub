package com.teamdev.processes.upload;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;
import com.teamdev.persistent.filestorage.FileStorage;

import javax.annotation.Nonnull;

/**
 * {@link FileUploadProcess} implementation.
 */
public class FileUploadProcessImpl implements FileUploadProcess {

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileUploadProcessImpl(
            @Nonnull FileDao fileDao,
            @Nonnull FileStorage fileStorage) {
        this.fileDao = fileDao;
        this.fileStorage = fileStorage;

    }

    @Override
    public Boolean run(FileUploadCommand command) throws FileAlreadyExistsException {

        FileRecord fileRecord = new FileRecord(new RecordIdentifier<>(command.filePath()),
                                               command.userId(),
                                               command.filePath());

        try {
            fileDao.create(fileRecord);
        } catch (DataAccessException exception) {
            throw new FileAlreadyExistsException(exception.getMessage());
        }

        fileStorage.uploadFile(command.filePath(), command.fileInputStream());

        return true;
    }
}
