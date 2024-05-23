package com.teamdev.filehub;

import com.teamdev.filehub.dao.DbConnection;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.JdbcAuthenticationDao;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.JdbcFileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.JdbcFolderDao;
import com.teamdev.filehub.dao.user.JdbcUserDao;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.postman.EmailService;
import com.teamdev.filehub.postman.SendGridEmailService;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationProcess;
import com.teamdev.filehub.processes.admin.authentication.AdminAuthenticationProcessImpl;
import com.teamdev.filehub.processes.filesystem.create.FolderCreateProcess;
import com.teamdev.filehub.processes.filesystem.create.FolderCreateProcessImpl;
import com.teamdev.filehub.processes.filesystem.remove.FileRemoveProcess;
import com.teamdev.filehub.processes.filesystem.remove.FolderRemoveProcess;
import com.teamdev.filehub.processes.filesystem.remove.RemoveProcess;
import com.teamdev.filehub.processes.filesystem.rename.FileRenameProcess;
import com.teamdev.filehub.processes.filesystem.rename.FolderRenameProcess;
import com.teamdev.filehub.processes.filesystem.rename.RenameProcess;
import com.teamdev.filehub.processes.filesystem.upload.FileUploadProcess;
import com.teamdev.filehub.processes.filesystem.upload.FileUploadProcessImpl;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.user.authentication.UserAuthenticationProcessImpl;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationProcess;
import com.teamdev.filehub.processes.user.confirmation.email.confirm.EmailConfirmationProcessImpl;
import com.teamdev.filehub.processes.user.confirmation.email.send.SendEmailConfirmationCommand;
import com.teamdev.filehub.processes.user.confirmation.email.send.SendEmailConfirmationProcess;
import com.teamdev.filehub.processes.user.confirmation.email.send.SendEmailConfirmationProcessImpl;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcess;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcessImpl;
import com.teamdev.filehub.processes.user.register.UserRegistrationProcess;
import com.teamdev.filehub.processes.user.register.UserRegistrationProcessImpl;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.authorization.UserAuthorizationViewImpl;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationView;
import com.teamdev.filehub.views.authorization.admin.AdminAuthorizationViewImpl;
import com.teamdev.filehub.views.download.FileDownloadView;
import com.teamdev.filehub.views.download.FileDownloadViewImpl;
import com.teamdev.filehub.views.folder.content.FolderContentView;
import com.teamdev.filehub.views.folder.content.FolderContentViewImpl;
import com.teamdev.filehub.views.folder.info.FolderInfoView;
import com.teamdev.filehub.views.folder.info.FolderInfoViewImpl;
import com.teamdev.filehub.views.folder.search.FolderSearchView;
import com.teamdev.filehub.views.folder.search.FolderSearchViewImpl;
import com.teamdev.filehub.views.userprofile.UserProfileView;
import com.teamdev.filehub.views.userprofile.UserProfileViewImpl;

import java.io.IOException;
import java.nio.file.Path;
import java.util.Properties;

/**
 * Configuration for services to provide dependency creation and injection.
 * Provides configured services.
 */
public class ServicesConfiguration {

    private final UserRegistrationProcess userRegistrationProcess;
    private final SendEmailConfirmationProcess sendEmailConfirmationProcess;
    private final EmailConfirmationProcess emailConfirmationProcess;
    private final UserAuthenticationProcess userAuthenticationProcess;
    private final UserLogoutProcess userLogoutProcess;
    private final UserAuthorizationView userAuthorizationView;
    private final UserProfileView userProfileView;

    private final AdminAuthenticationProcess adminAuthenticationProcess;
    private final AdminAuthorizationView adminAuthorizationView;

    private final FolderInfoView folderInfoView;
    private final FolderContentView folderContentView;
    private final FolderSearchView folderSearchView;
    private final RenameProcess folderRenameProcess;
    private final RemoveProcess folderRemoveProcess;

    private final FolderCreateProcess folderCreateProcess;
    private final FileUploadProcess fileUploadProcess;
    private final RenameProcess fileRenameProcess;
    private final RemoveProcess fileRemoveProcess;

    private final FileDownloadView fileDownloadView;

    public SendEmailConfirmationProcess getSendEmailConfirmationProcess() {
        return sendEmailConfirmationProcess;
    }

    public ServicesConfiguration() {

        Path storagePath = Path.of("storage")
                               .toAbsolutePath();

        Properties properties = new Properties();

        try (var resources = getClass().getClassLoader()
                                       .getResourceAsStream("secret.properties")
        ) {

            properties.load(resources);

        } catch (IOException e) {
            throw new RuntimeException("Properties file reading failed.", e);
        }

        DbConnection dbConnection = new DbConnection(properties.getProperty("db.url"),
                                                     properties.getProperty("db.user"),
                                                     properties.getProperty("db.password"));

        UserDao userDao = new JdbcUserDao(dbConnection, "users");
        AuthenticationDao authDao = new JdbcAuthenticationDao(dbConnection, "authentications");
        FileDao fileDao = new JdbcFileDao(dbConnection, "files");
        FolderDao folderDao = new JdbcFolderDao(dbConnection, "folders");

        FileStorage fileStorage = new FileStorage(storagePath.toString());

        EmailService emailService = new SendGridEmailService(properties.getProperty("sg.key"));

        userRegistrationProcess = new UserRegistrationProcessImpl(userDao, folderDao, emailService);
        emailConfirmationProcess = new EmailConfirmationProcessImpl(userDao);
        sendEmailConfirmationProcess = new SendEmailConfirmationProcessImpl(userDao, emailService);
        userAuthenticationProcess = new UserAuthenticationProcessImpl(userDao, authDao, emailService);
        userLogoutProcess = new UserLogoutProcessImpl(authDao);
        userAuthorizationView = new UserAuthorizationViewImpl(authDao);
        userProfileView = new UserProfileViewImpl(userDao, folderDao);

        adminAuthenticationProcess = new AdminAuthenticationProcessImpl();
        adminAuthorizationView = new AdminAuthorizationViewImpl();

        folderInfoView = new FolderInfoViewImpl(folderDao);
        folderContentView = new FolderContentViewImpl(folderDao, fileDao);
        folderSearchView = new FolderSearchViewImpl(folderDao, fileDao);
        folderRenameProcess = new FolderRenameProcess(folderDao);
        folderRemoveProcess = new FolderRemoveProcess(folderDao, fileDao, fileStorage);

        folderCreateProcess = new FolderCreateProcessImpl(folderDao);
        fileUploadProcess = new FileUploadProcessImpl(folderDao, fileDao, fileStorage);
        fileRenameProcess = new FileRenameProcess(fileDao);
        fileRemoveProcess = new FileRemoveProcess(fileDao, fileStorage);
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

    public FolderSearchView getFolderSearchView() {
        return folderSearchView;
    }

    public RemoveProcess getFileRemoveProcess() {
        return fileRemoveProcess;
    }

    public RemoveProcess getFolderRemoveProcess() {
        return folderRemoveProcess;
    }

    public AdminAuthenticationProcess getAdminAuthenticationProcess() {
        return adminAuthenticationProcess;
    }

    public AdminAuthorizationView getAdminAuthorizationView() {
        return adminAuthorizationView;
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

    public EmailConfirmationProcess getEmailConfirmationProcess() {
        return emailConfirmationProcess;
    }
}
