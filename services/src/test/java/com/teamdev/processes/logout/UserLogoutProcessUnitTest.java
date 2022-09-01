package com.teamdev.processes.logout;

import com.teamdev.AuthenticationDaoFake;
import com.teamdev.persistent.dao.DataAccessException;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.authentication.AuthenticationDao;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import com.teamdev.util.LocalDateTimeUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * Дуже файно, дуже подобається.
 */
class UserLogoutProcessUnitTest {

    private AuthenticationDao authDao;

    private UserLogoutProcess logoutProcess;

    @BeforeEach
    void setUp() {
        authDao = new AuthenticationDaoFake();
        logoutProcess = new UserLogoutProcessImpl(authDao);

    }

    @Test
    void logoutAuthenticatedUserTest() throws UserNotAuthenticatedException, DataAccessException {

        var realAuth = new AuthenticationRecord(new RecordId<>("user1"),
                                                "token1",
                                                LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                             .plusDays(1));

        authDao.create(realAuth);

        logoutProcess.handle(new UserLogoutCommand(realAuth.id()));

        assertThrows(DataAccessException.class, () -> authDao.find(realAuth.id()));

    }

    @Test
    void logoutNotAuthenticatedUser() {

        assertThrows(UserNotAuthenticatedException.class,
                     () -> logoutProcess.handle(
                             new UserLogoutCommand(new RecordId<>("notAuthenticated"))));

    }
}