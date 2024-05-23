package com.teamdev.filehub.processes.filesystem.upload;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.util.LocalDateTimeUtil;

import javax.annotation.Nonnull;
import java.time.LocalDateTime;
import java.util.Optional;

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
    public RecordId handle(@Nonnull FileUploadCommand command) throws
                                                               AccessDeniedException,
                                                               DataNotFoundException {

        logger.atInfo()
              .log("[PROCESS STARTED] - File uploading - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.fullname());

        Optional<FolderRecord> optionalFolderRecord = folderDao.find(command.folderId());

        if (optionalFolderRecord.isEmpty()) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - File uploading - Folder not found - user id: %s, file: %s.",
                       command.userId()
                              .value(),
                       command.fullname());

            throw new DataNotFoundException("Folder not found");
        }

        FolderRecord folderRecord = optionalFolderRecord.get();

        if (!folderRecord.ownerId()
                         .equals(command.userId())) {

            logger.atInfo()
                  .log("[PROCESS FAILED] - File uploading - Access denied - user id: %s, file: %s.",
                       command.userId()
                              .value(),
                       command.fullname());

            throw new AccessDeniedException("Access denied.");
        }

        RecordId fileId =
                new RecordId(command.userId()
                                    .value() +
                                     "_" +
                                     command.fullname() +
                                     LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                  .format(LocalDateTimeUtil.FORMATTER));

        var archivedSize = fileStorage.uploadFile(fileId, command.inputStream());
        var name = splitFileNameAndExtension(command.fullname());

        FileRecord fileRecord = new FileRecord(fileId,
                                               command.folderId(),
                                               command.userId(),
                                               name[0],
                                               command.mimetype(),
                                               command.size(),
                                               archivedSize,
                                               name[1]);

        fileDao.create(fileRecord);

        logger.atInfo()
              .log("[PROCESS FINISHED] - File uploading - user id: %s, file: %s.",
                   command.userId()
                          .value(),
                   command.fullname());

        return fileId;
    }

    public static String[] splitFileNameAndExtension(String fileName) {
        int lastDotIndex = fileName.lastIndexOf('.');
        if (lastDotIndex == -1 || lastDotIndex == 0) {
            return new String[]{fileName, ""};
        }

        String name = fileName.substring(0, lastDotIndex);
        String extension = fileName.substring(lastDotIndex + 1);
        return new String[]{name, extension};
    }
}
