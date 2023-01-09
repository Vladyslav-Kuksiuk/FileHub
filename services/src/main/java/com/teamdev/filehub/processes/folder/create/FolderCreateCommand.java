package com.teamdev.filehub.processes.folder.create;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.AuthenticatedUserCommand;
import com.teamdev.filehub.processes.CommandValidationException;

import javax.annotation.Nonnull;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * A {@link AuthenticatedUserCommand} implementation which is intended to store
 * data about folder creation.
 */
public class FolderCreateCommand extends AuthenticatedUserCommand {

    private final RecordId<String> parentFolderId;

    private final String folderName;

    public FolderCreateCommand(
            @Nonnull RecordId<String> userId,
            @Nonnull RecordId<String> parentFolderId,
            @Nonnull String folderName) throws CommandValidationException {
        super(userId);

        String namePatternRegex = "^[^%/\\\\&?,';:!-+!@#$^*)<>(]{1,50}$";

        Pattern namePattern = Pattern.compile(namePatternRegex);
        Matcher nameMatcher = namePattern.matcher(folderName);

        if (!nameMatcher.matches()) {
            throw new CommandValidationException("Folder name invalid.");
        }

        this.parentFolderId = Preconditions.checkNotNull(parentFolderId);
        this.folderName = Preconditions.checkNotNull(folderName);
    }

    public RecordId<String> parentFolderId() {
        return parentFolderId;
    }

    public String folderName() {
        return folderName;
    }
}