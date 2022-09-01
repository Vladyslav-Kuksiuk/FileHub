package com.teamdev.filehub.processes.logout;

import com.teamdev.filehub.AuthenticationDaoFake;
import com.teamdev.filehub.dao.DataAccessException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
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