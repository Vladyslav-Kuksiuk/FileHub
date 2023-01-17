package com.teamdev.filehub.views.folderinfo;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link FolderInfoView} implementation.
 */
public class FolderInfoViewImpl implements FolderInfoView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FolderDao folderDao;

    public FolderInfoViewImpl(@Nonnull FolderDao folderDao) {
        this.folderDao = Preconditions.checkNotNull(folderDao);
    }

    @Override
    public FolderInfo handle(@Nonnull FolderInfoQuery query)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(query);

        logger.atInfo()
              .log("[VIEW QUERIED] - Folder info - folderId: %s.", query.folderId()
                                                                        .value());

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(query.folderId());

        if (optionalFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Folder info - Folder not found - folderId: %s.",
                       query.folderId()
                            .value());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(query.userId())) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Folder info - Access denied - folderId: %s.",
                       query.folderId()
                            .value());

            throw new AccessDeniedException("Access to folder denied.");
        }

        logger.atInfo()
              .log("[VIEW FINISHED] - Folder info - folderId: %s.", folderRecord.id()
                                                                                .value());

        return new FolderInfo(folderRecord.name(),
                              folderRecord.id()
                                          .value(),
                              folderRecord.parentFolderId()
                                          .value());
    }
}
