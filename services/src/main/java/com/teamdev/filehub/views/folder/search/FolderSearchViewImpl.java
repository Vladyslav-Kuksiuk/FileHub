package com.teamdev.filehub.views.folder.search;

import com.google.common.base.Preconditions;
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

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(query.folderId());

        if (optionalFolderRecord.isEmpty()) {
            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(query.userId())) {
            throw new AccessDeniedException("Access to folder denied.");
        }

        List<FolderRecord> innerFolders =
                folderDao.getInnerFoldersByParentId(query.folderId());
        List<FileRecord> innerFiles =
                fileDao.getFilesInFolder(query.folderId());

        FolderContent folderContent = new FolderContent();

        innerFolders.stream()
                .filter(folder -> folder.name()
                                        .contains(query.searchWord()))
                .forEach(folder -> folderContent.addItem(
                        new FolderItem(folder.id()
                                             .value(),
                                       folder.parentFolderId()
                                             .value(),
                                       folder.name())));

        innerFiles.stream()
                .filter(file -> file.name()
                                    .contains(query.searchWord()))
                .forEach(file -> folderContent.addItem(
                        new FileItem(file.id()
                                         .value(),
                                     file.folderId()
                                         .value(),
                                     file.name(),
                                     file.size(),
                                     file.mimetype())
                ));

        return folderContent;
    }
}
