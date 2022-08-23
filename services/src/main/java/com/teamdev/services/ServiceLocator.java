package com.teamdev.services;

public interface ServiceLocator {

    <T extends ApplicationProcess<? extends Command, ? extends ServerResponse>> T
    locate(Class<T> clazz);

}
