package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;

public interface SqlRecordConverter<R extends DatabaseRecord> {

    R resultSetToRecord(@Nonnull ResultSet resultSet);

    String recordToInsertSql(@Nonnull R record);

    String recordToUpdateSql(@Nonnull R record);

}
