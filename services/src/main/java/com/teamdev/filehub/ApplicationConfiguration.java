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
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcessImpl;
import com.teamdev.filehub.processes.foldercreate.FolderCreateProcess;
import com.teamdev.filehub.processes.foldercreate.FolderCreateProcessImpl;
import com.teamdev.filehub.processes.logout.UserLogoutProcess;
import com.teamdev.filehub.processes.logout.UserLogoutProcessImpl;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import com.teamdev.filehub.processes.register.UserRegistrationProcessImpl;
import com.teamdev.filehub.processes.upload.FileUploadProcess;
import com.teamdev.filehub.processes.upload.FileUploadProcessImpl;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.authorization.UserAuthorizationViewImpl;
import com.teamdev.filehub.views.download.FileDownloadView;
import com.teamdev.filehub.views.download.FileDownloadViewImpl;
import com.teamdev.filehub.views.folderinfo.FolderInfoView;
import com.teamdev.filehub.views.folderinfo.FolderInfoViewImpl;
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

    private final FolderCreateProcess folderCreateProcess;
    private final FileUploadProcess fileUploadProcess;

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

        folderCreateProcess = new FolderCreateProcessImpl(folderDao);
        fileUploadProcess = new FileUploadProcessImpl(folderDao, fileDao, fileStorage);

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
}
