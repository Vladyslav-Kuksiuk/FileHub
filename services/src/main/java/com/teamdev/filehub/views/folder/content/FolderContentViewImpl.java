package com.teamdev.filehub.views.folder.content;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.views.folder.FileItem;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.FolderItem;

import javax.annotation.Nonnull;
import java.util.List;
import java.util.Optional;

/**
 * {@link FolderContentView} implementation.
 */
public class FolderContentViewImpl implements FolderContentView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FolderDao folderDao;
    private final FileDao fileDao;

    public FolderContentViewImpl(@Nonnull FolderDao folderDao,
                                 @Nonnull FileDao fileDao) {
        this.folderDao = Preconditions.checkNotNull(folderDao);
        this.fileDao = Preconditions.checkNotNull(fileDao);
    }

    @Override
    public FolderContent handle(@Nonnull FolderContentQuery query) throws AccessDeniedException,
                                                                          DataNotFoundException {
        Preconditions.checkNotNull(query);

        logger.atInfo()
              .log("[VIEW QUERIED] - Folder content - folderId: %s.", query.folderId()
                                                                           .value());

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(query.folderId());

        if (optionalFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Folder content - Folder not found - folderId: %s.",
                       query.folderId()
                            .value());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(query.userId())) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Folder content - Access denied - folderId: %s.",
                       query.folderId()
                            .value());

            throw new AccessDeniedException("Access to folder denied.");
        }

        List<FolderRecord> innerFolders =
                folderDao.getInnerFoldersByParentId(query.folderId());
        List<FileRecord> innerFiles =
                fileDao.getFilesInFolder(query.folderId());

        FolderContent folderContent = new FolderContent();

        innerFolders.forEach(folder -> folderContent.addItem(
                new FolderItem(folder.id()
                                     .value(),
                               folder.parentFolderId()
                                     .value(),
                               folder.name())));

        innerFiles.forEach(file -> folderContent.addItem(
                new FileItem(file.id()
                                 .value(),
                             file.folderId()
                                 .value(),
                             file.name(),
                             1,
                             file.extension())
        ));

        logger.atInfo()
              .log("[VIEW FINISHED] - Folder content - folderId: %s.", folderRecord.id()
                                                                                   .value());

        return folderContent;
    }
}
