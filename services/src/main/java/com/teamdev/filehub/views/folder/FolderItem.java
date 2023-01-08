package com.teamdev.filehub.views.folder;

/**
 * Server response which is intended to store
 * information about folder as {@link FolderContentItem}.
 */
public class FolderItem extends FolderContentItem {

    public FolderItem(String id, String parentId, String name) {
        super("folder", id, parentId, name);
    }
}
