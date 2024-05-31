package com.teamdev.filehub.views.admin.userstatistics;

import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.FilesStatistics;
import com.teamdev.filehub.dao.user.UserDao;

/**
 * {@link UserStatisticsView} implementation.
 */
public class UserStatisticsViewImpl implements UserStatisticsView {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;
    private final FileDao fileDao;

    public UserStatisticsViewImpl(UserDao userDao, FileDao folderDao) {
        this.fileDao = folderDao;
        this.userDao = userDao;
    }

    @Override
    public UserStatistic handle(UserStatisticsQuery query) throws DataNotFoundException {
        logger.atInfo()
                .log("[VIEW QUERIED] - User statistics.");

        var userProfile = userDao.findByLogin(query.targetUserEmail());

        if(userProfile.isEmpty()){
            logger.atInfo()
                    .log("[VIEW FAILED] - User statistics. - User not found");
            throw new DataNotFoundException("User not found");
        }

        var filesStatistics = fileDao.getFilesStatistics(userProfile.get().id());

        logger.atInfo()
                .log("[VIEW FINISHED] - User statistics.");

        return new UserStatistic(userProfile.get().isBanned(), filesStatistics.items());
    }
}
