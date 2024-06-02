package com.teamdev.filehub.views.admin.statistics;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FilesStatistics;

/**
 * {@link FilesStatisticsView} implementation.
 */
public class FilesStatisticsViewImpl implements FilesStatisticsView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final FileDao fileDao;

    public FilesStatisticsViewImpl(FileDao folderDao) {
        this.fileDao = folderDao;
    }

    @Override
    public FilesStatistics handle(FilesStatisticsQuery query) {
        logger.atInfo()
                .log("[VIEW QUERIED] - Files statistics.");

        var statistics = fileDao.getFilesStatistics();

        logger.atInfo()
                .log("[VIEW FINISHED] - Files statistics.");
        return statistics;
    }
}
