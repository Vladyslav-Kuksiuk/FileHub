package com.teamdev.server;

import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.processes.authentication.UserDataMismatchException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;

import java.util.HashMap;
import java.util.Map;

public class ExceptionStatusFactory {

    private final Map<Class<? extends Exception>, Integer> exceptionStatusMap = new HashMap<>();

    public ExceptionStatusFactory() {
        exceptionStatusMap.put(UserDataMismatchException.class, 401);
        exceptionStatusMap.put(AccessDeniedException.class, 401);
        exceptionStatusMap.put(DataNotFoundException.class, 404);
        exceptionStatusMap.put(UserAlreadyRegisteredException.class, 409);
    }

    public int getStatus(Class<? extends Exception> exceptionClass) {

        if (exceptionStatusMap.containsKey(exceptionClass)) {

            return exceptionStatusMap.get(exceptionClass);

        }

        return 500;
    }
}
