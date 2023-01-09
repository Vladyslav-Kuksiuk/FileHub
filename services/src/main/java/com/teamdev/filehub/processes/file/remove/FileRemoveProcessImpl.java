package com.teamdev.filehub.processes.file.remove;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;

import java.util.Optional;

/**
 * {@link FileRemoveProcess} implementation.
 */
public class FileRemoveProcessImpl implements FileRemoveProcess {

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileRemoveProcessImpl(FileDao fileDao,
                                 FileStorage fileStorage) {
        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    @Override
    public RecordId<String> handle(FileRemoveCommand command)
            throws AccessDeniedException, DataNotFoundException {

        Optional<FileRecord> optionalFileRecord = fileDao.find(command.fileId());

        if (optionalFileRecord.isEmpty()) {
            throw new DataNotFoundException("File not found");
        }

        FileRecord fileRecord = optionalFileRecord.get();

        if (!fileRecord.ownerId()
                       .equals(command.userId())) {
            throw new AccessDeniedException("Access to file denied.");
        }

        fileDao.delete(command.fileId());
        fileStorage.removeFile(command.fileId());

        return command.fileId();
    }
}
