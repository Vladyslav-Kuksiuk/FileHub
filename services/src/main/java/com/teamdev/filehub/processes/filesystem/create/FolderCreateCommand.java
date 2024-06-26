package com.teamdev.filehub.processes.filesystem.create;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.RequestFieldValidationException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;

import javax.annotation.Nonnull;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * A {@link AuthenticatedUserCommand} implementation to represent 'create folder' request.
 */
public class FolderCreateCommand extends AuthenticatedUserCommand {

    private final RecordId parentFolderId;

    private final String folderName;

    public FolderCreateCommand(
            @Nonnull RecordId userId,
            @Nonnull RecordId parentFolderId,
            @Nonnull String folderName) throws RequestFieldValidationException {
        super(userId);
        Preconditions.checkNotNull(userId);
        Preconditions.checkNotNull(parentFolderId);
        Preconditions.checkNotNull(folderName);

        String namePatternRegex = "^[^%/\\\\&?,';:!-+!@#$^*)<>(]{1,50}$";

        Pattern namePattern = Pattern.compile(namePatternRegex);
        Matcher nameMatcher = namePattern.matcher(folderName);

        if (!nameMatcher.matches()) {
            throw new RequestFieldValidationException("folderName", "Folder name invalid.");
        }

        this.parentFolderId = Preconditions.checkNotNull(parentFolderId);
        this.folderName = Preconditions.checkNotNull(folderName);
    }

    public RecordId parentFolderId() {
        return parentFolderId;
    }

    public String folderName() {
        return folderName;
    }
}
