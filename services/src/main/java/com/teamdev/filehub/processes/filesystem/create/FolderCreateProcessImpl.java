package com.teamdev.filehub.processes.filesystem.create;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.util.LocalDateTimeUtil;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;
import java.util.Optional;

import static com.teamdev.util.StringEncryptor.encrypt;

/**
 * {@link FolderCreateProcess} implementation.
 */
public class FolderCreateProcessImpl implements FolderCreateProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FolderDao folderDao;

    public FolderCreateProcessImpl(@Nonnull FolderDao folderDao) {
        this.folderDao = Preconditions.checkNotNull(folderDao);
    }

    @Override
    public RecordId handle(@Nonnull FolderCreateCommand command)
            throws DataNotFoundException, AccessDeniedException {

        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - Folder creation - user id: %s, folderName: %s.",
                   command.userId()
                          .value(),
                   command.folderName());

        Optional<FolderRecord> optionalParentFolderRecord =
                folderDao.find(command.parentFolderId());

        if (optionalParentFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - Folder creation - Folder not found - user id: %s, folderName: %s.",
                       command.userId()
                              .value(),
                       command.folderName());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord parentFolderRecord = optionalParentFolderRecord.get();

        if (!parentFolderRecord.ownerId()
                               .equals(command.userId())) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - Folder creation - Access denied - user id: %s, folderName: %s.",
                       command.userId()
                              .value(),
                       command.folderName());

            throw new AccessDeniedException("Access to folder denied.");
        }

        RecordId newFolderId =
                new RecordId(encrypt(command.userId()
                        .value() +
                        command.folderName() +
                        LocalDateTime.now(
                                LocalDateTimeUtil.TIME_ZONE)));

        FolderRecord newFolderRecord = new FolderRecord(newFolderId,
                                                        command.userId(),
                                                        command.parentFolderId(),
                                                        command.folderName());

        folderDao.create(newFolderRecord);

        logger.atInfo()
              .log("[PROCESS FINISHED] - Folder creation - user id: %s, folderName: %s.",
                   command.userId()
                          .value(),
                   command.folderName());

        return newFolderId;
    }
}
