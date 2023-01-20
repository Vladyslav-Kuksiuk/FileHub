package com.teamdev.filehub;

import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.InMemoryAuthenticationDao;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.InMemoryFileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.InMemoryFolderDao;
import com.teamdev.filehub.dao.user.InMemoryUserDao;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.filesystem.create.FolderCreateProcess;
import com.teamdev.filehub.processes.filesystem.create.FolderCreateProcessImpl;
import com.teamdev.filehub.processes.filesystem.rename.FileRenameProcess;
import com.teamdev.filehub.processes.filesystem.rename.FolderRenameProcess;
import com.teamdev.filehub.processes.filesystem.rename.RenameProcess;
import com.teamdev.filehub.processes.filesystem.upload.FileUploadProcess;
import com.teamdev.filehub.processes.filesystem.upload.FileUploadProcessImpl;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationProcessImpl;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcess;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcessImpl;
import com.teamdev.filehub.processes.user.register.UserRegistrationProcess;
import com.teamdev.filehub.processes.user.register.UserRegistrationProcessImpl;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.authorization.UserAuthorizationViewImpl;
import com.teamdev.filehub.views.download.FileDownloadView;
import com.teamdev.filehub.views.download.FileDownloadViewImpl;
import com.teamdev.filehub.views.folder.content.FolderContentView;
import com.teamdev.filehub.views.folder.content.FolderContentViewImpl;
import com.teamdev.filehub.views.folder.info.FolderInfoView;
import com.teamdev.filehub.views.folder.info.FolderInfoViewImpl;
import com.teamdev.filehub.views.userprofile.UserProfileView;
import com.teamdev.filehub.views.userprofile.UserProfileViewImpl;

import java.nio.file.Path;

/**
 * Class which intended to configure services implementations.
 */
public class ApplicationConfiguration {

    private final UserRegistrationProcess userRegistrationProcess;
    private final UserAuthenticationProcess userAuthenticationProcess;
    private final UserLogoutProcess userLogoutProcess;
    private final UserAuthorizationView userAuthorizationView;
    private final UserProfileView userProfileView;

    private final FolderInfoView folderInfoView;
    private final FolderContentView folderContentView;
    private final RenameProcess folderRenameProcess;

    private final FolderCreateProcess folderCreateProcess;
    private final FileUploadProcess fileUploadProcess;
    private final RenameProcess fileRenameProcess;

    private final FileDownloadView fileDownloadView;

    public ApplicationConfiguration() {

        Path storagePath = Path.of("storage")
                               .toAbsolutePath();

        InMemoryDatabase database = new InMemoryDatabase(storagePath.toString());
        UserDao userDao = new InMemoryUserDao(database.userTable());
        AuthenticationDao authDao = new InMemoryAuthenticationDao(database.authenticationTable());
        FileDao fileDao = new InMemoryFileDao(database.fileTable());
        FolderDao folderDao = new InMemoryFolderDao(database.folderTable());

        FileStorage fileStorage = new FileStorage(storagePath.toString());

        userRegistrationProcess = new UserRegistrationProcessImpl(userDao, folderDao);
        userAuthenticationProcess = new UserAuthenticationProcessImpl(userDao, authDao);
        userLogoutProcess = new UserLogoutProcessImpl(authDao);
        userAuthorizationView = new UserAuthorizationViewImpl(authDao);
        userProfileView = new UserProfileViewImpl(userDao, folderDao);

        folderInfoView = new FolderInfoViewImpl(folderDao);
        folderContentView = new FolderContentViewImpl(folderDao, fileDao);
        folderRenameProcess = new FolderRenameProcess(folderDao);

        folderCreateProcess = new FolderCreateProcessImpl(folderDao);
        fileUploadProcess = new FileUploadProcessImpl(folderDao, fileDao, fileStorage);
        fileRenameProcess = new FileRenameProcess(fileDao);

        fileDownloadView = new FileDownloadViewImpl(fileDao, fileStorage);

    }

    public UserRegistrationProcess getUserRegistrationProcess() {
        return userRegistrationProcess;
    }

    public UserAuthenticationProcess getUserAuthenticationProcess() {
        return userAuthenticationProcess;
    }

    public UserLogoutProcess getUserLogoutProcess() {
        return userLogoutProcess;
    }

    public FileDownloadView getFileDownloadView() {
        return fileDownloadView;
    }

    public UserProfileView getUserProfileView() {
        return userProfileView;
    }

    public FolderCreateProcess getFolderCreateProcess() {
        return folderCreateProcess;
    }

    public FileUploadProcess getFileUploadProcess() {
        return fileUploadProcess;
    }

    public FolderInfoView getFolderInfoView() {
        return folderInfoView;
    }

    public UserAuthorizationView getUserAuthorizationView() {
        return userAuthorizationView;
    }

    public FolderContentView getFolderContentView() {
        return folderContentView;
    }

    public RenameProcess getFolderRenameProcess() {
        return folderRenameProcess;
    }

    public RenameProcess getFileRenameProcess() {
        return fileRenameProcess;
    }
}
