package com.teamdev;

import com.teamdev.ServerResponse;
import com.teamdev.processes.ApplicationProcess;
import com.teamdev.processes.Command;

/**
 * Class which intended to configure {@link ApplicationProcess} implementations.
 */
public interface ServiceLocator {

    /**
     * Method witch is intended to give configured {@link ApplicationProcess} implementation.
     *
     * @param clazz
     *         {@link ApplicationProcess} class which configured implementation is requested.
     * @param <T>
     *         {@link ApplicationProcess} type which configured implementation is requested.
     * @return configured {@link ApplicationProcess} implementation.
     */
    <T extends ApplicationProcess<? extends Command, ? extends ServerResponse>> T
    locate(Class<T> clazz);

}
