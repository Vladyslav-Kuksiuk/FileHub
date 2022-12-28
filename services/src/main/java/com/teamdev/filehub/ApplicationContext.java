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
import com.teamdev.filehub.views.download.FileDownloadView;
import com.teamdev.filehub.views.download.FileDownloadViewImpl;

/**
 * Class which intended to configure services implementations.
 */
public class ApplicationContext {
    private final UserRegistrationProcess userRegistrationProcess;
    private final UserAuthenticationProcess userAuthenticationProcess;
    private final UserLogoutProcess userLogoutProcess;

    private final FolderCreateProcess folderCreateProcess;
    private final FileUploadProcess fileUploadProcess;

    private final FileDownloadView fileDownloadView;

    public ApplicationContext() {
        InMemoryDatabase database = new InMemoryDatabase();
        UserDao userDao = new InMemoryUserDao(database.userTable());
        AuthenticationDao authDao = new InMemoryAuthenticationDao(database.authenticationTable());
        FileDao fileDao = new InMemoryFileDao(database.fileTable());
        FolderDao folderDao = new InMemoryFolderDao(database.folderTable());

        FileStorage fileStorage = new FileStorage();

        userRegistrationProcess = new UserRegistrationProcessImpl(userDao, folderDao);
        userAuthenticationProcess = new UserAuthenticationProcessImpl(userDao, authDao);
        userLogoutProcess = new UserLogoutProcessImpl(authDao);

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

    public FolderCreateProcess getFolderCreateProcess() {
        return folderCreateProcess;
    }

    public FileUploadProcess getFileUploadProcess() {
        return fileUploadProcess;
    }
}
