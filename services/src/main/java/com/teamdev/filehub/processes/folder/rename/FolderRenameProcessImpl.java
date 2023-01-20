package com.teamdev.filehub.processes.folder.rename;

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
public class FolderRenameProcessImpl implements FolderRenameProcess {

    private final FolderDao folderDao;

    public FolderRenameProcessImpl(@Nonnull FolderDao folderDao) {
        Preconditions.checkNotNull(folderDao);
        this.folderDao = folderDao;
    }

    @Override
    public RecordId<String> handle(FolderRenameCommand command) throws AccessDeniedException,
                                                                       DataNotFoundException {

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(command.folderId());

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
