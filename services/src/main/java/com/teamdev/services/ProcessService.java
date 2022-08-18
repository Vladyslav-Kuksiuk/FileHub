package com.teamdev.services;

import javax.validation.constraints.NotNull;

/**
 * A Service Interface which is intended to process commands.
 *
 * @param <C>
 *         {@link Command}.
 */
public interface ProcessService<C extends Command> {

    void run(@NotNull C command);

}
