package com.teamdev.services;

import com.teamdev.persistent.dao.DataAccessException;

public interface View<Q extends Query, R extends ServerResponse> {

    R request(Q query) throws DataAccessException;

}
