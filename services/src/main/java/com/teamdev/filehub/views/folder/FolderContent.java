package com.teamdev.filehub.views.folder;

import com.google.common.base.Preconditions;

import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

public class FolderContent {

    private final List<FolderContentItem> items = new LinkedList<>();

    public void addItem(FolderContentItem item) {
        Preconditions.checkNotNull(item);
        items.add(item);
    }

    public List<FolderContentItem> getItems() {
        return Collections.unmodifiableList(items);
    }
}
