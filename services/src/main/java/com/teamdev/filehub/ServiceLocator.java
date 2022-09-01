package com.teamdev.filehub;

import com.teamdev.filehub.processes.ApplicationProcess;
import com.teamdev.filehub.processes.Command;

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
    <T extends ApplicationProcess<? extends Command, ?>> T
    locate(Class<T> clazz);

}
