package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;

public interface SqlRecordConverter<I, R extends DatabaseRecord<I>> {

    R resultSetToRecord(@Nonnull ResultSet resultSet);

    String recordToInsertSql(@Nonnull R record);

    String recordToUpdateSql(@Nonnull R record);

}
