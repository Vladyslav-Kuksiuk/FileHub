package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.filestorage.FileStorage;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link RemoveProcess} implementation.
 */
public class FileRemoveProcess implements RemoveProcess {

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileRemoveProcess(@Nonnull FileDao fileDao,
                             @Nonnull FileStorage fileStorage) {

        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    @Override
    public RecordId<String> handle(@Nonnull RemoveCommand command)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(command);

        Optional<FileRecord> optionalFileRecord = fileDao.find(command.itemId());

        if (optionalFileRecord.isEmpty()) {
            throw new DataNotFoundException("File not found");
        }

        FileRecord fileRecord = optionalFileRecord.get();

        if (!fileRecord.ownerId()
                       .equals(command.userId())) {
            throw new AccessDeniedException("Access to file denied.");
        }

        fileDao.delete(command.itemId());
        fileStorage.removeFile(command.itemId());

        return command.itemId();
    }
}
