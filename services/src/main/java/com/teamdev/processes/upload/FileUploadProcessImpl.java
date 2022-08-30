package com.teamdev.processes.upload;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;
import com.teamdev.persistent.filestorage.FileStorage;

import javax.annotation.Nonnull;

/**
 * {@link FileUploadProcess} implementation.
 */
public class FileUploadProcessImpl implements FileUploadProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileUploadProcessImpl(
            @Nonnull FileDao fileDao,
            @Nonnull FileStorage fileStorage) {
        this.fileDao = fileDao;
        this.fileStorage = fileStorage;

    }

    @Override
    public Boolean handle(@Nonnull FileUploadCommand command) throws FileAlreadyExistsException {

        FileRecord fileRecord = new FileRecord(new RecordId<>(command.filePath()),
                                               command.userId(),
                                               command.filePath());

        logger.atInfo()
              .log("[PROCESS STARTED] - File uploading - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.filePath());

        try {
            fileDao.create(fileRecord);
        } catch (DataAccessException exception) {

            logger.atWarning()
                  .log("[PROCESS FAILED] - File uploading - user id: %s, file: %s - Exception message: %s.",
                       command.userId()
                              .value(),
                       command.filePath(),
                       exception.getMessage());

            throw new FileAlreadyExistsException(exception.getMessage());
        }

        fileStorage.uploadFile(command.filePath(), command.fileInputStream());

        logger.atInfo()
              .log("[PROCESS FINISHED] - File uploading - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.filePath());

        return true;
    }
}
