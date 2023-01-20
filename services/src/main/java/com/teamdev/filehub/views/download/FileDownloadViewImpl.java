package com.teamdev.filehub.views.download;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.views.Query;

import javax.annotation.Nonnull;
import java.io.InputStream;
import java.util.Optional;

/**
 * {@link FileDownloadView} implementation.
 */
public class FileDownloadViewImpl implements FileDownloadView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileDownloadViewImpl(@Nonnull FileDao fileDao,
                                @Nonnull FileStorage fileStorage) {

        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    /**
     * Method to find file by path and return it, if user have access.
     *
     * @param query
     *         {@link Query} implementation to request.
     * @return {@link InputStream} The file input stream.
     */
    @Override
    public InputStream handle(@Nonnull FileDownloadQuery query)
            throws AccessDeniedException, DataNotFoundException {
        Preconditions.checkNotNull(query);

        logger.atInfo()
              .log("[VIEW STARTED] - File download - login: %s, file: %s.", query.userId()
                                                                                 .value(),
                   query.fileId()
                        .value());

        Optional<FileRecord> optionalFileRecord = fileDao.find(query.fileId());

        if (optionalFileRecord.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - File download - login: %s, file: %s - Exception message: File not found.",
                       query.userId()
                            .value(),
                       query.fileId()
                            .value());

            throw new DataNotFoundException("Folder not found");
        }

        FileRecord fileRecord = optionalFileRecord.get();

        if (!query.userId()
                  .equals(fileRecord.ownerId())) {

            logger.atInfo()
                  .log("[VIEW FAILED] - File download - login: %s, file: %s - Exception message: Access to file not allowed.",
                       query.userId()
                            .value(),
                       query.fileId()
                            .value());

            throw new AccessDeniedException("Access to file denied.");

        }

        InputStream fileInput = fileStorage.downloadFile(query.fileId());

        logger.atInfo()
              .log("[VIEW FINISHED] - File download - login: %s, file: %s.", query.userId()
                                                                                  .value(),
                   query.fileId()
                        .value());

        return fileInput;
    }
}
