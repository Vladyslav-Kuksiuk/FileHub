package com.teamdev.filehub.processes.filesystem.share;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.views.folder.FileItem;

import javax.annotation.Nonnull;
import java.util.UUID;

/**
 * {@link ChangeFileShareStatusProcess} implementation.
 */
public class ChangeFileShareStatusProcessImpl implements ChangeFileShareStatusProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;

    public ChangeFileShareStatusProcessImpl(@Nonnull FileDao fileDao) {
        this.fileDao = Preconditions.checkNotNull(fileDao);
    }

    @Override
    public FileItem handle(@Nonnull ChangeFileShareStatusCommand command)
            throws DataNotFoundException, AccessDeniedException {

        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - File sharing - user id: %s, file id: %s.",
                   command.userId()
                          .value(),
                      command.fileId()
                              .value());

        var optFile = fileDao.find(command.fileId());

        if (optFile.isEmpty()){
            logger.atInfo()
                    .log("[PROCESS FAILED] - File sharing - File not found - user id: %s, file id: %s.",
                            command.userId()
                                    .value(),
                            command.fileId()
                                    .value());

            throw new DataNotFoundException("File not found");
        }

        var file = optFile.get();

        if(!file.ownerId().equals(command.userId())) {
            logger.atInfo()
                    .log("[PROCESS FAILED] - File sharing - Access denied - user id: %s, file id: %s.",
                            command.userId()
                                    .value(),
                            command.fileId()
                                    .value());

            throw new AccessDeniedException("User don't have permissions to share the file");
        }
        String shareTag = null;
        if(command.shareStatus()) {
            shareTag = UUID.randomUUID().toString();
        }

        fileDao.update(new FileRecord(
                file.id(),
                file.folderId(),
                file.ownerId(),
                file.name(),
                file.mimetype(),
                file.size(),
                file.archivedSize(),
                file.extension(),
                shareTag
        ));

        logger.atInfo()
                .log("[PROCESS FINISHED] - File sharing - user id: %s, file id: %s.",
                        command.userId()
                                .value(),
                        command.fileId()
                                .value());

        return new FileItem(
                file.id().value(),
                file.folderId().value(),
                file.name(),
                file.size(),
                file.mimetype(),
                file.archivedSize(),
                file.extension(),
                shareTag
        );
    }
}
