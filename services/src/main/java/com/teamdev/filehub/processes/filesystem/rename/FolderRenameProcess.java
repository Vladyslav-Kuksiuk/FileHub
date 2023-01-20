package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link FolderRenameProcess} implementation.
 */
public class FolderRenameProcess implements RenameProcess {

    private final FolderDao folderDao;

    public FolderRenameProcess(@Nonnull FolderDao folderDao) {
        Preconditions.checkNotNull(folderDao);
        this.folderDao = folderDao;
    }

    @Override
    public RecordId<String> handle(RenameCommand command) throws AccessDeniedException,
                                                                       DataNotFoundException {

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(command.itemId());

        if (optionalFolderRecord.isEmpty()) {
            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(command.userId())) {
            throw new AccessDeniedException("Access to folder denied.");
        }

        folderDao.update(new FolderRecord(folderRecord.id(),
                                          folderRecord.ownerId(),
                                          folderRecord.parentFolderId(),
                                          command.newName()));

        return folderRecord.id();
    }
}
