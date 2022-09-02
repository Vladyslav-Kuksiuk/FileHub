package com.teamdev.filehub.views.download;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FileRecord;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.views.Query;

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

        FileRecord fileRecord = fileDao.find(query.fileId())
                                       .get();

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
