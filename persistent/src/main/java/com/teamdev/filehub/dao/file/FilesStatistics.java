package com.teamdev.filehub.dao.file;

import com.google.common.base.Preconditions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Files statistics.
 */
public class FilesStatistics {

    private final List<FilesStatisticsMimetypeItem> items = new ArrayList<>();

    public void addMimetypeItem(FilesStatisticsMimetypeItem item) {
        Preconditions.checkNotNull(item);
        items.add(item);
    }

    public List<FilesStatisticsMimetypeItem> items() {
        return Collections.unmodifiableList(items);
    }
}
