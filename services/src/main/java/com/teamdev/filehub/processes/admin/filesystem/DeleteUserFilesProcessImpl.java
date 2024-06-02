package com.teamdev.filehub.processes.admin.filesystem;

import com.google.common.base.Preconditions;
import com.google.common.flogger.FluentLogger;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.FolderRecord;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.filesystem.remove.RemoveCommand;
import com.teamdev.filehub.processes.filesystem.remove.RemoveProcess;

import javax.annotation.Nonnull;
import java.util.Optional;

/**
 * {@link RemoveProcess} implementation to provide folder removing.
 */
public class DeleteUserFilesProcessImpl implements DeleteUserFilesProcess {

    private final FluentLogger logger = FluentLogger.forEnclosingClass();

    private final UserDao userDao;
    private final FolderDao folderDao;
    private final FileDao fileDao;
    private final FileStorage fileStorage;

    public DeleteUserFilesProcessImpl(@Nonnull UserDao userDao,
            @Nonnull FolderDao folderDao,
                                      @Nonnull FileDao fileDao,
                                      @Nonnull FileStorage fileStorage) {

        this.userDao = Preconditions.checkNotNull(userDao);
        this.folderDao = Preconditions.checkNotNull(folderDao);
        this.fileDao = Preconditions.checkNotNull(fileDao);
        this.fileStorage = Preconditions.checkNotNull(fileStorage);
    }

    @Override
    public Boolean handle(@Nonnull DeleteUserFilesCommand command) throws DataNotFoundException {
        Preconditions.checkNotNull(command);

        logger.atInfo()
              .log("[PROCESS STARTED] - User files deletion - user email: %s.",
                   command.targetUserEmail());

        var optUser = userDao.findByLogin(command.targetUserEmail());

        if(optUser.isEmpty()){
            logger.atInfo()
                    .log("[PROCESS FAILED] - User files deletion - User not found - user email: %s.",
                            command.targetUserEmail());
            throw new DataNotFoundException("User not found");
        }

        var rootFolder = folderDao.findUserRootFolder(optUser.get().id());

        removeInFolder(rootFolder.get().id());

        logger.atInfo()
              .log("[PROCESS FINISHED] - User files deletion - user email: %s.",
                   command.userId()
                          .value());

        return true;
    }

    private void removeInFolder(RecordId folderId) {
        fileDao.getByFolderId(folderId)
                .forEach(file -> {
                    fileDao.delete(file.id());
                    fileStorage.removeFile(file.id());
                });

        folderDao.getByParentId(folderId)
                .forEach(folder -> {
                    removeInFolder(folder.id());
                    folderDao.delete(folder.id());
                });
    }
}
