package com.teamdev.filehub.views.file;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.folder.FileItem;
import com.teamdev.util.LocalDateTimeUtil;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * {@link SharedFileView} implementation.
 */
public class SharedFileViewImpl implements SharedFileView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;

    public SharedFileViewImpl(FileDao fileDao) {
        this.fileDao = Preconditions.checkNotNull(fileDao);
    }

    @Override
    public FileItem handle(SharedFileQuery query) throws DataNotFoundException {

        logger.atInfo()
              .log("[VIEW QUERIED] - Shared file - tag: %s.", query.shareTag());

        var optFile = fileDao.getByShareTag(
                query.shareTag());

        if (optFile.isEmpty()) {

            logger.atInfo()
                  .log("[VIEW FAILED] - Shared file - File not found - tag: %s.",
                          query.shareTag());

            throw new DataNotFoundException("File not found");
        }

        var file = optFile.get();

        logger.atInfo()
              .log("[VIEW FINISHED] - Shared file - tag: %s.", query.shareTag());


        return new FileItem(
                file.id().value(),
                file.ownerId().value(),
                file.name(),
                file.size(),
                file.mimetype(),
                file.archivedSize(),
                file.extension(),
                file.shareTag()
        );
    }
}
