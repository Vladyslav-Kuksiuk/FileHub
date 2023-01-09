package com.teamdev.filehub.processes.folder.remove;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;

import java.util.Optional;

/**
 * {@link FolderRemoveProcess} implementation.
 */
public class FolderRemoveProcessImpl implements FolderRemoveProcess {

    private final FolderDao folderDao;
    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FolderRemoveProcessImpl(FolderDao folderDao,
                                   FileDao fileDao,
                                   FileStorage fileStorage) {

        this.folderDao = Preconditions.checkNotNull(folderDao);
        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    @Override
    public RecordId<String> handle(FolderRemoveCommand command)
            throws AccessDeniedException, DataNotFoundException {

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(command.folderId());

        if (optionalFolderRecord.isEmpty()) {
            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(command.userId()) ||
                folderRecord.parentFolderId() == null) {
            throw new AccessDeniedException("Access to folder denied.");
        }

        removeFolder(folderRecord.id());

        return command.folderId();
    }

    private void removeFolder(RecordId<String> folderId) {
        fileDao.getFilesInFolder(folderId)
               .forEach(file -> {
                   fileDao.delete(file.id());
                   fileStorage.removeFile(file.id());
               });

        folderDao.getInnerFoldersByParentId(folderId)
                 .forEach(folder -> removeFolder(folder.id()));

        folderDao.delete(folderId);
    }
}
