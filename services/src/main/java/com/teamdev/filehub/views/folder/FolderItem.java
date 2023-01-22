package com.teamdev.filehub.views.folder;

import com.google.common.base.Preconditions;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * DTO with information about folder as {@link FolderContentItem}.
 */
public class FolderItem extends FolderContentItem {

    public FolderItem(@Nonnull String id,
                      @Nullable String parentId,
                      @Nonnull String name) {
        super("folder",
              Preconditions.checkNotNull(id),
              parentId,
              Preconditions.checkNotNull(name));
    }
}
