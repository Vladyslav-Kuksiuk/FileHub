package com.teamdev.services.filesave;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;
import com.teamdev.persistent.filestorage.FileStorage;

import javax.annotation.Nonnull;

public class FileUploadProcessImpl extends FileUploadProcess {

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileUploadProcessImpl(
            @Nonnull AuthenticationDao authenticationDao,
            @Nonnull FileDao fileDao,
            @Nonnull FileStorage fileStorage) {
        super(authenticationDao);
        this.fileDao = fileDao;
        this.fileStorage = fileStorage;

    }

    @Override
    public FileUploadResponse run(FileUploadCommand command) throws DataAccessException {

        authorize(command);

        FileRecord fileRecord = new FileRecord(new RecordIdentifier<>(command.filePath()),
                                               command.userId(),
                                               command.filePath());

        fileDao.create(fileRecord);

        fileStorage.uploadFile(command.filePath(), command.fileInputStream());

        return new FileUploadResponse();
    }
}
