package com.teamdev.views.download;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
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
    public FileDownloadResponse request(FileDownloadQuery query) throws FileAccessDeniedException {

        FileRecord fileRecord = null;
        try {
            fileRecord = fileDao.find(new RecordIdentifier<>(query.filePath()));
        } catch (DataAccessException exception) {
            throw new FileAccessDeniedException(exception.getMessage());
        }

        if (!query.userId()
                  .equals(fileRecord.ownerId()
                                    .getValue())) {

            throw new FileAccessDeniedException("Access to file not allowed.");

        }

        InputStream fileInput = fileStorage.downloadFile(query.filePath());

        return new FileDownloadResponse(fileInput);
    }
}
