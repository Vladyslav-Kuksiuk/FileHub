package com.teamdev.filehub.views.admin.userstatistics;

import com.teamdev.filehub.dao.file.FilesStatisticsMimetypeItem;

import java.util.List;

public class UserStatistic {

    private final boolean isBanned;
    private final List<FilesStatisticsMimetypeItem> items;

    public UserStatistic(boolean isBanned, List<FilesStatisticsMimetypeItem> items) {
        this.isBanned = isBanned;
        this.items = items;
    }

    public boolean isBanned() {
        return isBanned;
    }

    public List<FilesStatisticsMimetypeItem> items() {
        return items;
    }
}
