package com.teamdev.persistent.dao;

import javax.validation.constraints.NotNull;

public interface DataAccessObject<R extends DatabaseRecord, I> {

    R find(@NotNull RecordIdentifier<I> id);

    void delete(@NotNull RecordIdentifier<I> id);

    void create(@NotNull R record);

    void update(@NotNull R record);

}
