package com.teamdev.servicelocator;

import com.google.common.base.Preconditions;
import com.teamdev.ServerResponse;
import com.teamdev.ServiceLocator;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.InMemoryAuthenticationDao;
import com.teamdev.persistent.dao.file.FileDao;
import com.teamdev.persistent.dao.file.InMemoryFileDao;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.persistent.filestorage.FileStorage;
import com.teamdev.processes.ApplicationProcess;
import com.teamdev.processes.Command;
import com.teamdev.processes.authentication.UserAuthenticationProcess;
import com.teamdev.processes.authentication.UserAuthenticationProcessImpl;
import com.teamdev.processes.logout.UserLogoutProcess;
import com.teamdev.processes.logout.UserLogoutProcessImpl;
import com.teamdev.processes.register.UserRegistrationProcess;
import com.teamdev.processes.register.UserRegistrationProcessImpl;
import com.teamdev.processes.upload.FileUploadProcess;
import com.teamdev.processes.upload.FileUploadProcessImpl;

import javax.annotation.Nonnull;
import java.util.HashMap;
import java.util.Map;

/**
 * {@link ServiceLocator} implementation which is configured to work with {@link InMemoryDatabase}.
 */
public class ServiceLocatorImpl implements ServiceLocator {

    private final Map<Class<? extends ApplicationProcess<? extends Command, ? extends ServerResponse>>, ApplicationProcess> services =
            new HashMap<>();

    public ServiceLocatorImpl() {

        try {
            InMemoryDatabase database = new InMemoryDatabase();
            UserDao userDao = new InMemoryUserDao(database);
            AuthenticationDao authDao = new InMemoryAuthenticationDao(database);
            FileDao fileDao = new InMemoryFileDao(database);

            FileStorage fileStorage = new FileStorage();

            services.put(UserRegistrationProcess.class, new UserRegistrationProcessImpl(userDao));
            services.put(UserAuthenticationProcess.class,
                         new UserAuthenticationProcessImpl(userDao, authDao));
            services.put(UserLogoutProcess.class, new UserLogoutProcessImpl(authDao));
            services.put(FileUploadProcess.class,
                         new FileUploadProcessImpl(fileDao, fileStorage));

        } catch (DatabaseException e) {
            throw new RuntimeException("Database connection creation failed.");
        }

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
