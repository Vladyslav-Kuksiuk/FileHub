package com.teamdev.filehub.processes.foldercreate;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.processes.AccessDeniedException;
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
                                                                         AccessDeniedException {

        RecordId<String> folderId = new RecordId<>(command.userId()
                                                          .value() +
                                                           command.folderName() +
                                                           LocalDateTime.now(
                                                                   LocalDateTimeUtil.TIME_ZONE));

        FolderRecord folderRecord = new FolderRecord(folderId,
                                                     command.userId(),
                                                     command.parentFolderId(),
                                                     command.folderName());

        if (!folderDao.find(command.parentFolderId())
                      .get()
                      .ownerId()
                      .equals(command.userId())) {
            throw new AccessDeniedException("Folder creation access denied.");
        }

        folderDao.create(folderRecord);

        return folderId;
    }
}
