package com.teamdev.filehub.views.folder;

public class FolderContentItem {

    private final String type;
    private final String id;
    private final String parentId;
    private final String name;

    public FolderContentItem(String type, String id, String parentId, String name) {
        this.type = type;
        this.id = id;
        this.parentId = parentId;
        this.name = name;
    }

    public String type() {
        return type;
    }

    public String id() {
        return id;
    }

    public String parentId() {
        return parentId;
    }

    public String name() {
        return name;
    }
}
