package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.filestorage.FileStorage;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link RemoveProcess} implementation for file.
 */
public class FileRemoveProcess implements RemoveProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileRemoveProcess(@Nonnull FileDao fileDao,
                             @Nonnull FileStorage fileStorage) {

        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    @Override
    public RecordId handle(@Nonnull RemoveCommand command)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - File removing - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        Optional<FileRecord> optionalFileRecord = fileDao.find(command.itemId());

        if (optionalFileRecord.isEmpty()) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - File removing - File not found - user id: %s, file: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new DataNotFoundException("File not found");
        }

        FileRecord fileRecord = optionalFileRecord.get();

        if (!fileRecord.ownerId()
                       .equals(command.userId())) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - File removing - Access denied - user id: %s, file: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new AccessDeniedException("Access to file denied.");
        }

        fileDao.delete(command.itemId());
        fileStorage.removeFile(command.itemId());

        logger.atInfo()
              .log("[PROCESS FINISHED] - File removing - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        return command.itemId();
    }
}
