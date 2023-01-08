package com.teamdev.filehub.processes.renamefile;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.filehub.processes.DataNotFoundException;

import java.util.Optional;

/**
 * {@link RenameFileProcess} implementation.
 */
public class RenameFileProcessImpl implements RenameFileProcess {

    private final FileDao fileDao;

    public RenameFileProcessImpl(FileDao fileDao) {
        this.fileDao = fileDao;
    }

    @Override
    public RecordId<String> handle(RenameFileCommand command) throws AccessDeniedException,
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
