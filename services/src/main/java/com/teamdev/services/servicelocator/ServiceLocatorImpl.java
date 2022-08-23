package com.teamdev.services.servicelocator;

import com.google.common.base.Preconditions;
import com.teamdev.database.DatabaseException;
import com.teamdev.database.InMemoryDatabase;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.InMemoryAuthenticationDao;
import com.teamdev.persistent.dao.user.InMemoryUserDao;
import com.teamdev.persistent.dao.user.UserDao;
import com.teamdev.services.ApplicationProcess;
import com.teamdev.services.Command;
import com.teamdev.services.ServerResponse;
import com.teamdev.services.ServiceLocator;
import com.teamdev.services.authentication.UserAuthenticationProcess;
import com.teamdev.services.authentication.UserAuthenticationProcessImpl;
import com.teamdev.services.logout.UserLogoutProcess;
import com.teamdev.services.logout.UserLogoutProcessImpl;
import com.teamdev.services.register.UserRegistrationProcess;
import com.teamdev.services.register.UserRegistrationProcessImpl;

import java.util.HashMap;
import java.util.Map;

public class ServiceLocatorImpl implements ServiceLocator {

    private final Map<Class<? extends ApplicationProcess<? extends Command, ? extends ServerResponse>>, ApplicationProcess> services =
            new HashMap<>();

    public ServiceLocatorImpl() {

        try {
            InMemoryDatabase database = new InMemoryDatabase();
            UserDao userDao = new InMemoryUserDao(database);
            AuthenticationDao authDao = new InMemoryAuthenticationDao(database);

            services.put(UserRegistrationProcess.class, new UserRegistrationProcessImpl(userDao));
            services.put(UserAuthenticationProcess.class,
                         new UserAuthenticationProcessImpl(userDao, authDao));
            services.put(UserLogoutProcess.class, new UserLogoutProcessImpl(authDao));

        } catch (DatabaseException e) {
            throw new RuntimeException("Database connection creation failed.");
        }

    }

    @Override
    public ApplicationProcess locate(Class serviceClass) {
        Preconditions.checkNotNull(serviceClass);
        Preconditions.checkState(services.containsKey(serviceClass), "Service implementation not found.");
        return services.get(serviceClass);
    }
}
