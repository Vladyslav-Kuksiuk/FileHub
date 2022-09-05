package com.teamdev.filehub.dao;

import java.sql.ResultSet;

public interface SqlRecordConverter<I, R extends DatabaseRecord<I>> {

    R resultSetToRecord(ResultSet resultSet);

    String recordToInsertSql(R record);

    String recordToUpdateSql(R record);

}
