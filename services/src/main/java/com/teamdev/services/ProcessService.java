package com.teamdev.services;

import javax.validation.constraints.NotNull;

public interface ProcessService<C extends Command> {

    void run(@NotNull C command);

}
