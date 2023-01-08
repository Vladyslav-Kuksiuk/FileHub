package com.teamdev.filehub.views.folder;

public class FileItem extends FolderContentItem {

    private final long size;
    private final String mimetype;

    public FileItem(String id, String parentId, String name, long size,
                    String mimetype) {
        super("file", id, parentId, name);
        this.size = size;
        this.mimetype = mimetype;
    }

    public long size() {
        return size;
    }

    public String mimetype() {
        return mimetype;
    }
}
