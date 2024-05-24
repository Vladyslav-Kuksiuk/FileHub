package com.teamdev.filehub.views.admin.statistics;

import com.teamdev.filehub.dao.file.FilesStatistics;
import com.teamdev.filehub.views.View;

/**
 * {@link View} to handle {@link FilesStatisticsQuery}.
 */
public interface FilesStatisticsView extends View<FilesStatisticsQuery, FilesStatistics> {

    @Override
    FilesStatistics handle(FilesStatisticsQuery query);
}
