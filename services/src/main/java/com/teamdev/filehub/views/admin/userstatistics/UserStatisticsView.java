package com.teamdev.filehub.views.admin.userstatistics;

import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.file.FilesStatistics;
import com.teamdev.filehub.views.View;

/**
 * {@link View} to handle {@link UserStatisticsQuery}.
 */
public interface UserStatisticsView extends View<UserStatisticsQuery, UserStatistic> {

    @Override
    UserStatistic handle(UserStatisticsQuery query) throws DataNotFoundException;
}
