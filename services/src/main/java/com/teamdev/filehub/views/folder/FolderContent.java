package com.teamdev.filehub.views.folder;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;

/**
 * Server response which is intended to store
 * information about the folder content.
 */
public class FolderContent {

    private final List<FolderContentItem> items = new LinkedList<>();

    public void addItem(@Nonnull FolderContentItem item) {
        Preconditions.checkNotNull(item);
        items.add(item);
    }

    public List<FolderContentItem> items() {
        return Collections.unmodifiableList(items);
    }
}
