package com.teamdev.processes.foldercreate;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.folder.FolderDao;
import com.teamdev.persistent.dao.folder.FolderRecord;
import com.teamdev.util.LocalDateTimeUtil;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * {@link FolderCreateProcess} implementation.
 */
public class FolderCreateProcessImpl implements FolderCreateProcess {

    private final FolderDao folderDao;

    public FolderCreateProcessImpl(@Nonnull FolderDao folderDao) {
        this.folderDao = folderDao;
    }

    @Override
    public RecordId<String> handle(@Nonnull FolderCreateCommand command) throws
                                                                         FolderCreateException {

        RecordId<String> folderId = new RecordId<>(command.userId()
                                                          .value() +
                                                   command.folderName() +
                                                   LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE));

        FolderRecord folderRecord = new FolderRecord(folderId,
                                                     command.userId(),
                                                     command.parentFolderId(),
                                                     command.folderName());

        try {
            if (!folderDao.find(command.parentFolderId())
                          .ownerId()
                          .equals(command.userId())) {
                throw new FolderCreateException("Folder creation access denied.");
            }

            if (folderDao.getInnerFoldersByParentId(command.parentFolderId())
                         .stream()
                         .anyMatch(record -> record.name()
                                                   .equals(command.folderName()))) {
                throw new FolderCreateException("Folder with same path and name already exists.");
            }

            folderDao.create(folderRecord);

        } catch (DataAccessException e) {
            throw new FolderCreateException(e.getMessage());
        }

        return folderId;
    }
}
