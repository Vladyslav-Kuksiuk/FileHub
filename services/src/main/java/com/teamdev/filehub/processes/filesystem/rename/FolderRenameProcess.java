package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link RenameProcess} implementation to provide folder renaming.
 */
public class FolderRenameProcess implements RenameProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FolderDao folderDao;

    public FolderRenameProcess(@Nonnull FolderDao folderDao) {
        Preconditions.checkNotNull(folderDao);
        this.folderDao = folderDao;
    }

    @Override
    public RecordId handle(@Nonnull RenameCommand command)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - Folder renaming - user id: %s, folder: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(command.itemId());

        if (optionalFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - Folder renaming - Folder not found - user id: %s, folder: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(command.userId())) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - Folder renaming - Access denied - user id: %s, folder: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new AccessDeniedException("Access to folder denied.");
        }

        folderDao.update(new FolderRecord(folderRecord.id(),
                                          folderRecord.ownerId(),
                                          folderRecord.parentFolderId(),
                                          command.newName()));

        logger.atInfo()
              .log("[PROCESS FINISHED] - Folder renaming - user id: %s, folder: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        return folderRecord.id();
    }
}
