package com.teamdev.filehub.views.folder;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * Server response which is intended to store
 * information about file as {@link FolderContentItem}.
 */
public class FileItem extends FolderContentItem {

    private final long size;
    private final String mimetype;

    public FileItem(@Nonnull String id,
                    @Nonnull String parentId,
                    @Nonnull String name,
                    long size,
                    @Nonnull String mimetype) {
        super("file",
              Preconditions.checkNotNull(id),
              Preconditions.checkNotNull(parentId),
              Preconditions.checkNotNull(name));

        this.size = size;
        this.mimetype = Preconditions.checkNotNull(mimetype);
    }

    public long size() {
        return size;
    }

    public String mimetype() {
        return mimetype;
    }
}
