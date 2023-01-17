package com.teamdev.server;

import com.google.common.base.Preconditions;
import com.google.gson.JsonSyntaxException;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.processes.authentication.UserCredentialsMismatchException;
import com.teamdev.filehub.processes.register.UserAlreadyRegisteredException;

import javax.annotation.Nonnull;
import java.util.HashMap;
import java.util.Map;

/**
 * Binding to convert exceptions into HTTP status codes.
 */
public class ExceptionToStatusBinding {

    private final Map<Class<? extends Exception>, Integer> exceptionStatusMap = new HashMap<>();

    ExceptionToStatusBinding() {
        exceptionStatusMap.put(JsonEntityValidationException.class, 400);
        exceptionStatusMap.put(JsonSyntaxException.class, 400);

        exceptionStatusMap.put(UserCredentialsMismatchException.class, 401);
        exceptionStatusMap.put(AccessDeniedException.class, 401);

        exceptionStatusMap.put(DataNotFoundException.class, 404);

        exceptionStatusMap.put(UserAlreadyRegisteredException.class, 409);
    }

    /**
     * Converts exceptions class into HTTP status code.
     *
     * @param exceptionClass
     *         - {@link Exception} class.
     * @return HTTP status code.
     */
    public int getStatus(@Nonnull Class<? extends Exception> exceptionClass) {
        Preconditions.checkNotNull(exceptionClass);

        if (exceptionStatusMap.containsKey(exceptionClass)) {

            return exceptionStatusMap.get(exceptionClass);

        }

        return 500;
    }
}
