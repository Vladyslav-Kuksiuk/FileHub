package com.teamdev.filehub.dao;

import javax.annotation.Nonnull;
import java.sql.ResultSet;

public interface SqlRecordConverter<R extends DatabaseRecord> {

    R resultSetToRecord(@Nonnull ResultSet resultSet);

    String recordInsertSql(@Nonnull R record);

    String recordUpdateSql(@Nonnull R record);

}
