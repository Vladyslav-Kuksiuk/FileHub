package com.teamdev.filehub.servicelocator;

import com.google.common.base.Preconditions;
import com.teamdev.filehub.InMemoryDatabase;
import com.teamdev.filehub.ServiceLocator;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.InMemoryAuthenticationDao;
import com.teamdev.filehub.dao.file.FileDao;
import com.teamdev.filehub.dao.file.InMemoryFileDao;
import com.teamdev.filehub.dao.folder.FolderDao;
import com.teamdev.filehub.dao.folder.InMemoryFolderDao;
import com.teamdev.filehub.dao.user.InMemoryUserDao;
import com.teamdev.filehub.dao.user.UserDao;
import com.teamdev.filehub.filestorage.FileStorage;
import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.Command;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcess;
import com.teamdev.filehub.processes.authentication.UserAuthenticationProcessImpl;
import com.teamdev.filehub.processes.logout.UserLogoutProcess;
import com.teamdev.filehub.processes.logout.UserLogoutProcessImpl;
import com.teamdev.filehub.processes.register.UserRegistrationProcess;
import com.teamdev.filehub.processes.register.UserRegistrationProcessImpl;
import com.teamdev.filehub.processes.upload.FileUploadProcess;
import com.teamdev.filehub.processes.upload.FileUploadProcessImpl;

import javax.annotation.Nonnull;
import java.util.HashMap;
import java.util.Map;

/**
 * {@link ServiceLocator} implementation which is configured to work with {@link InMemoryDatabase}.
 */
public class ServiceLocatorImpl implements ServiceLocator {

    private final Map<Class<? extends ApplicationProcess<? extends Command, ?>>, ApplicationProcess> services =
            new HashMap<>();

    public ServiceLocatorImpl() {

        InMemoryDatabase database = new InMemoryDatabase();
        UserDao userDao = new InMemoryUserDao(database);
        AuthenticationDao authDao = new InMemoryAuthenticationDao(database);
        FileDao fileDao = new InMemoryFileDao(database);
        FolderDao folderDao = new InMemoryFolderDao(database);

        FileStorage fileStorage = new FileStorage();

        services.put(UserRegistrationProcess.class,
                     new UserRegistrationProcessImpl(userDao, folderDao));
        services.put(UserAuthenticationProcess.class,
                     new UserAuthenticationProcessImpl(userDao, authDao));
        services.put(UserLogoutProcess.class, new UserLogoutProcessImpl(authDao));
        services.put(FileUploadProcess.class,
                     new FileUploadProcessImpl(folderDao, fileDao, fileStorage));

    }

    /**
     * Method witch is intended to give configured {@link ApplicationProcess} implementation
     * for work with {@link InMemoryDatabase}.
     *
     * @param serviceClass
     *         {@link ApplicationProcess} class which configured implementation is requested.
     * @return configured {@link ApplicationProcess} implementation.
     */
    @Override
    public ApplicationProcess locate(@Nonnull Class serviceClass) {
        Preconditions.checkNotNull(serviceClass);
        Preconditions.checkState(services.containsKey(serviceClass),
                                 "Service implementation not found.");
        return services.get(serviceClass);
    }
}
