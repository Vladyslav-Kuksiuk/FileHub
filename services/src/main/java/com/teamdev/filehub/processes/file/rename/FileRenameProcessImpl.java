package com.teamdev.filehub.processes.file.rename;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link FileRenameProcess} implementation.
 */
public class FileRenameProcessImpl implements FileRenameProcess {

    private final FileDao fileDao;

    public FileRenameProcessImpl(@Nonnull FileDao fileDao) {
        Preconditions.checkNotNull(fileDao);
        this.fileDao = fileDao;
    }

    @Override
    public RecordId<String> handle(FileRenameCommand command) throws AccessDeniedException,
                                                                     DataNotFoundException {

        Optional<FileRecord> optionalFileRecord = fileDao.find(command.fileId());

        if (optionalFileRecord.isEmpty()) {
            throw new DataNotFoundException("File not found");
        }

        FileRecord fileRecord = optionalFileRecord.get();

        if (!fileRecord.ownerId()
                       .equals(command.userId())) {
            throw new AccessDeniedException("Access to file denied.");
        }

        fileDao.update(new FileRecord(fileRecord.id(), fileRecord.folderId(), fileRecord.ownerId(),
                                      command.newName(), fileRecord.mimetype(), fileRecord.size()));

        return fileRecord.id();
    }
}
