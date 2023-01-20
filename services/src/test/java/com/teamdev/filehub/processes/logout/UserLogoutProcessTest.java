package com.teamdev.filehub.processes.logout;

import com.teamdev.filehub.AuthenticationDaoFake;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
import com.teamdev.filehub.processes.user.logout.UserLogoutCommand;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcess;
import com.teamdev.filehub.processes.user.logout.UserLogoutProcessImpl;
import com.teamdev.util.LocalDateTimeUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

class UserLogoutProcessTest {

    private AuthenticationDao authDao;

    private UserLogoutProcess logoutProcess;

    @BeforeEach
    void setUp() {
        authDao = new AuthenticationDaoFake();
        logoutProcess = new UserLogoutProcessImpl(authDao);

    }

    @Test
    void logoutAuthenticatedUserTest() {

        var realAuth = new AuthenticationRecord(new RecordId<>("token1"),
                                                "token1",
                                                LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                                                             .plusDays(1),
                                                new RecordId<>("user1"));

        authDao.create(realAuth);

        logoutProcess.handle(
                new UserLogoutCommand(realAuth.userId(), realAuth.authenticationToken()));

        assertWithMessage("User logout failed.")
                .that(authDao.find(realAuth.id()))
                .isEqualTo(Optional.empty());

    }

    @Test
    void logoutNotAuthenticatedUser() {

        assertThrows(RuntimeException.class,
                     () -> logoutProcess.handle(
                             new UserLogoutCommand(new RecordId<>("notAuthenticated"),
                                                   "notAToken")));

    }
}
