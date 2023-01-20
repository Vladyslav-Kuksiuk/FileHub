package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;

import javax.annotation.Nonnull;
import java.util.Optional;

public class FileRenameProcess implements RenameProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;

    public FileRenameProcess(@Nonnull FileDao fileDao) {
        Preconditions.checkNotNull(fileDao);
        this.fileDao = fileDao;
    }

    @Override
    public RecordId<String> handle(@Nonnull RenameCommand command)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - File renaming - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        Optional<FileRecord> optionalFileRecord = fileDao.find(command.itemId());

        if (optionalFileRecord.isEmpty()) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - File renaming - Folder not found - user id: %s, file: %s.",
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
                  .log("[PROCESS FAILED] - File renaming - Access denied - user id: %s, file: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new AccessDeniedException("Access to file denied.");
        }

        fileDao.update(new FileRecord(fileRecord.id(),
                                      fileRecord.folderId(),
                                      fileRecord.ownerId(),
                                      command.newName(),
                                      fileRecord.mimetype(),
                                      fileRecord.size()));

        logger.atInfo()
              .log("[PROCESS FINISHED] - File renaming - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        return fileRecord.id();
    }
}
