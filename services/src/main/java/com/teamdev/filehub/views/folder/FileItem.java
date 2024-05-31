package com.teamdev.filehub.views.folder;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;

/**
 * DTO with information about file as {@link FolderContentItem}.
 */
public class FileItem extends FolderContentItem {

    private final long size;
    private final long archivedSize;
    private final String mimetype;
    private final String extension;
    private final String shareTag;

    public FileItem(@Nonnull String id,
                    @Nonnull String parentId,
                    @Nonnull String name,
                    long size,
                    @Nonnull String mimetype,
                    long archivedSize,
                    String extension,
                    String shareTag) {
        super("file",
              Preconditions.checkNotNull(id),
              Preconditions.checkNotNull(parentId),
              Preconditions.checkNotNull(name));

        this.size = size;
        this.archivedSize = archivedSize;
        this.mimetype = Preconditions.checkNotNull(mimetype);
        this.extension = Preconditions.checkNotNull(extension);
        this.shareTag = shareTag;
    }

    public long size() {
        return size;
    }

    public long archivedSize() {
        return archivedSize;
    }

    public String mimetype() {
        return mimetype;
    }

    public String extension() {
        return extension;
    }

    public String shareLink() {
        return shareTag;
    }
}
