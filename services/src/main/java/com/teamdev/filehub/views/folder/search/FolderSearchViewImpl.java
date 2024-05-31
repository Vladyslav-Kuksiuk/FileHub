package com.teamdev.filehub.views.folder.search;

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
 * {@link FolderSearchView} implementation.
 */
public class FolderSearchViewImpl implements FolderSearchView {
    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FolderDao folderDao;
    private final FileDao fileDao;

    public FolderSearchViewImpl(@Nonnull FolderDao folderDao,
                                @Nonnull FileDao fileDao) {
        this.folderDao = Preconditions.checkNotNull(folderDao);
        this.fileDao = Preconditions.checkNotNull(fileDao);
    }

    @Override
    public FolderContent handle(@Nonnull FolderSearchQuery query)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(query);

        logger.atInfo()
              .log("[VIEW QUERIED] - Folder search - folderId: %s, search word: %s.",
                   query.folderId()
                        .value(),
                   query.searchWord());

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(query.folderId());

        if (optionalFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Folder search - Folder not found - folderId: %s, search word: %s.",
                       query.folderId()
                            .value(),
                       query.searchWord());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(query.userId())) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Folder search - Access denied - folderId: %s, search word: %s.",
                       query.folderId()
                            .value(),
                       query.searchWord());

            throw new AccessDeniedException("Access to folder denied.");
        }

        List<FolderRecord> folders =
                folderDao.getByParentIdAndNamePart(query.folderId(), query.searchWord());
        List<FileRecord> files =
                fileDao.getByFolderIdAndNamePart(query.folderId(), query.searchWord());

        FolderContent folderContent = new FolderContent();

        folders.forEach(folder -> folderContent.addItem(
                new FolderItem(folder.id()
                                     .value(),
                               folder.parentFolderId()
                                     .value(),
                               folder.name())));

        files.forEach(file -> folderContent.addItem(
                new FileItem(file.id()
                                 .value(),
                             file.folderId()
                                 .value(),
                             file.name(),
                             file.size(),
                             file.mimetype(),
                             file.archivedSize(),
                             file.extension(),
                             file.shareTag())
        ));

        logger.atInfo()
              .log("[VIEW FINISHED] - Folder search - folderId: %s, search word: %s.",
                   query.folderId()
                        .value(),
                   query.searchWord());

        return folderContent;
    }
}
