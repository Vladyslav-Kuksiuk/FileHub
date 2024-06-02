package com.teamdev.filehub.views.file;

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
 * {@link SharedFileDownloadView} implementation.
 */
public class SharedFileDownloadViewImpl implements SharedFileDownloadView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public SharedFileDownloadViewImpl(@Nonnull FileDao fileDao,
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
    public InputStream handle(@Nonnull SharedFileDownloadQuery query) throws DataNotFoundException {
        Preconditions.checkNotNull(query);

        logger.atInfo()
              .log("[VIEW STARTED] - File download");

        var optionalFileRecord = fileDao.getByShareTag(query.shareTag());

        if (optionalFileRecord.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - File download - Exception message: File not found.");

            throw new DataNotFoundException("File not found");
        }

        var fileRecord = optionalFileRecord.get();

        InputStream fileInput = fileStorage.downloadFile(fileRecord.id());

        logger.atInfo()
              .log("[VIEW FINISHED] - File download.");

        return fileInput;
    }
}
