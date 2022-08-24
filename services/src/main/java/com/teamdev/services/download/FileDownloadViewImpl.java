package com.teamdev.services.download;

import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordIdentifier;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.FileRecord;
import com.teamdev.persistent.filestorage.FileStorage;

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

    @Override
    public FileDownloadResponse request(FileDownloadQuery query) throws DataAccessException {

        FileRecord fileRecord = fileDao.find(new RecordIdentifier<>(query.filePath()));

        if (!query.userId()
                  .equals(fileRecord.ownerId()
                                    .getValue())) {

            throw new DataAccessException("Access to file not allowed.");

        }

        InputStream fileInput = fileStorage.downloadFile(query.filePath());

        return new FileDownloadResponse(fileInput);
    }
}
