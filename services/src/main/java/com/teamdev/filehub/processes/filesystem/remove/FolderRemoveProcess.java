package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.filestorage.FileStorage;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link FolderRemoveProcess} implementation.
 */
public class FolderRemoveProcess implements RemoveProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FolderDao folderDao;
    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FolderRemoveProcess(@Nonnull FolderDao folderDao,
                               @Nonnull FileDao fileDao,
                               @Nonnull FileStorage fileStorage) {

        this.folderDao = Preconditions.checkNotNull(folderDao);
        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    @Override
    public RecordId handle(@Nonnull RemoveCommand command)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - Folder removing - user id: %s, folder: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(command.itemId());

        if (optionalFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - Folder removing - Folder not found - user id: %s, folder: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(command.userId()) ||
                folderRecord.parentFolderId() == null) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - Folder removing - Access denied - user id: %s, folder: %s.",
                       command.userId()
                              .value(),
                       command.itemId()
                              .value());

            throw new AccessDeniedException("Access to folder denied.");
        }

        removeFolder(folderRecord.id());

        logger.atInfo()
              .log("[PROCESS FINISHED] - Folder removing - user id: %s, folder: %s.",
                   command.userId()
                          .value(),
                   command.itemId()
                          .value());

        return command.itemId();
    }

    private void removeFolder(RecordId folderId) {
        fileDao.getFilesInFolder(folderId)
               .forEach(file -> {
                   fileDao.delete(file.id());
                   fileStorage.removeFile(file.id());
               });

        folderDao.getByParentId(folderId)
                 .forEach(folder -> removeFolder(folder.id()));

        folderDao.delete(folderId);
    }
}
