package com.teamdev.filehub.views.folderinfo;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;

import java.util.Optional;

/**
 * {@link FolderInfoView} implementation.
 */
public class FolderInfoViewImpl implements FolderInfoView {

    private final FolderDao folderDao;
    private final FileDao fileDao;

    public FolderInfoViewImpl(FolderDao folderDao, FileDao fileDao) {
        this.folderDao = folderDao;
        this.fileDao = fileDao;
    }

    @Override
    public FolderInfo handle(FolderInfoQuery query)
            throws AccessDeniedException, DataNotFoundException {

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(query.folderId());

        if (optionalFolderRecord.isEmpty()) {
            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(query.userId())) {
            throw new AccessDeniedException("Access to folder denied.");
        }

        int innerFoldersAmount = folderDao.getInnerFoldersByParentId(query.folderId())
                                          .size();
        int innerFilesAmount = fileDao.getFilesInFolder(query.folderId())
                                      .size();

        return new FolderInfo(folderRecord.name(),
                              folderRecord.id()
                                          .value(),
                              innerFoldersAmount + innerFilesAmount,
                              folderRecord.parentFolderId()
                                          .value());
    }
}
