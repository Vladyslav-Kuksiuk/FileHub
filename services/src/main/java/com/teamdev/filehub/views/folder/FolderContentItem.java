package com.teamdev.filehub.views.folder;

import com.google.common.base.Objects;

/**
 * Server response which is intended to store
 * information about the folder content item.
 */
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

    @Override
    public int hashCode() {
        return Objects.hashCode(type, id, parentId, name);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FolderContentItem item = (FolderContentItem) o;
        return Objects.equal(type, item.type) &&
                Objects.equal(id, item.id) &&
                Objects.equal(parentId, item.parentId) &&
                Objects.equal(name, item.name);
    }
}
