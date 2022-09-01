package com.teamdev.views.download;

import com.google.common.flogger.FluentLogger;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;
import com.teamdev.persistent.filestorage.FileStorage;
import com.teamdev.views.Query;

import javax.annotation.Nonnull;
import java.io.InputStream;

/**
 * {@link FileDownloadView} implementation.
 */
public class FileDownloadViewImpl implements FileDownloadView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public FileDownloadViewImpl(@Nonnull FileDao fileDao,
                                @Nonnull FileStorage fileStorage) {
        this.fileDao = fileDao;
        this.fileStorage = fileStorage;
    }

    /**
     * Method to find file by path and return it, if user have access.
     *
     * @param query
     *         {@link Query} implementation to request.
     * @return {@link FileDownloadResponse}.
     */
    @Override
    public FileDownloadResponse handle(@Nonnull FileDownloadQuery query) throws
                                                                         FileAccessDeniedException {

        logger.atInfo()
              .log("[VIEW STARTED] - File download - login: %s, file: %s.", query.userId()
                                                                                 .value(),
                   query.fileId()
                        .value());

        FileRecord fileRecord = null;
        try {
            fileRecord = fileDao.find(query.fileId());
        } catch (DataAccessException exception) {
            throw new FileAccessDeniedException(exception.getMessage());
        }

        if (!query.userId()
                  .value()
                  .equals(fileRecord.ownerId()
                                    .value())) {

            logger.atInfo()
                  .log("[VIEW FAILED] - File download - login: %s, file: %s - Exception message: Access to file not allowed .",
                       query.userId()
                            .value(), query.fileId()
                                           .value());

            throw new FileAccessDeniedException("Access to file not allowed.");

        }

        InputStream fileInput = fileStorage.downloadFile(query.fileId());

        logger.atInfo()
              .log("[VIEW FINISHED] - File download - login: %s, file: %s.", query.userId()
                                                                                  .value(),
                   query.fileId()
                        .value());

        return new FileDownloadResponse(fileInput);
    }
}
