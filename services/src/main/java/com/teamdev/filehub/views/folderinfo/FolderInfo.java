package com.teamdev.filehub.views.folderinfo;

/**
 * Server response which is intended to store
 * information about the folder.
 */
public class FolderInfo {

    private final String name;
    private final String id;
    private final String type;
    private final String parentId;

    public FolderInfo(String name, String id, String parentId) {
        this.name = name;
        this.id = id;
        this.type = "folder";
        this.parentId = parentId;
    }

    public String name() {
        return name;
    }

    public String id() {
        return id;
    }


    public String type() {
        return type;
    }

    public String parentId() {
        return parentId;
    }
}
