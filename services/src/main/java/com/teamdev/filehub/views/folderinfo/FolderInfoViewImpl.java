package com.teamdev.filehub.views.folderinfo;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;

import java.util.Optional;

/**
 * {@link FolderInfoView} implementation.
 */
public class FolderInfoViewImpl implements FolderInfoView {

    private final FolderDao folderDao;

    public FolderInfoViewImpl(FolderDao folderDao) {
        this.folderDao = folderDao;
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

        return new FolderInfo(folderRecord.name(),
                              folderRecord.id()
                                          .value(),
                              folderRecord.parentFolderId()
                                          .value());
    }
}
