package com.teamdev.filehub.processes.file.rename;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;

import java.util.Optional;

/**
 * {@link FileRenameProcess} implementation.
 */
public class FileRenameProcessImpl implements FileRenameProcess {

    private final FileDao fileDao;

    public FileRenameProcessImpl(FileDao fileDao) {
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
