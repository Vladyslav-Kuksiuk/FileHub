package com.teamdev.filehub.processes.upload;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.AccessDeniedException;
import com.teamdev.util.LocalDateTimeUtil;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;

/**
 * {@link FileUploadProcess} implementation.
 */
public class FileUploadProcessImpl implements FileUploadProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();
    private final FileDao fileDao;
    private final FolderDao folderDao;
    private final FileStorage fileStorage;

    public FileUploadProcessImpl(
            @Nonnull FolderDao folderDao,
            @Nonnull FileDao fileDao,
            @Nonnull FileStorage fileStorage) {
        this.folderDao = folderDao;
        this.fileDao = fileDao;
        this.fileStorage = fileStorage;

    }

    @Override
    public RecordId<String> handle(@Nonnull FileUploadCommand command) throws
                                                                       AccessDeniedException {

        if (!folderDao.find(command.folderId())
                      .get()
                      .ownerId()
                      .equals(command.userId())) {
            throw new AccessDeniedException("Access denied.");
        }

        RecordId<String> fileId =
                new RecordId<String>(command.userId()
                                            .value() +
                                             "_" +
                                             command.fileName() +
                                             LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                          .format(LocalDateTimeUtil.FORMATTER));

        FileRecord fileRecord = new FileRecord(fileId,
                                               command.folderId(),
                                               command.userId(),
                                               command.fileName(),
                                               command.fileExtension());

        logger.atInfo()
              .log("[PROCESS STARTED] - File uploading - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.fileName());

        fileDao.create(fileRecord);

        fileStorage.uploadFile(fileId, command.fileInputStream());

        logger.atInfo()
              .log("[PROCESS FINISHED] - File uploading - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.fileName());

        return fileId;
    }
}
