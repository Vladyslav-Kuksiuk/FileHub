package com.teamdev.filehub.views.authorization;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.dao.authentication.AuthenticationDao;
import com.teamdev.filehub.dao.authentication.AuthenticationRecord;
import com.teamdev.util.LocalDateTimeUtil;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;

public class UserAuthorizationViewImplTest {

    @Test
    @DisplayName("Should return user id")
    void shouldReturnAuthorizedUserId() throws UserAuthorizationException {
        AuthenticationRecord authenticationRecord = new AuthenticationRecord(
                new RecordId("token"),
                "token",
                LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                             .plusDays(1),
                new RecordId("recordId"));

        UserAuthorizationQuery authorizationQuery =
                new UserAuthorizationQuery(authenticationRecord.authenticationToken());

        AuthenticationDao authenticationDao = Mockito.mock(AuthenticationDao.class);

        UserAuthorizationView userAuthorizationView =
                new UserAuthorizationViewImpl(authenticationDao);

        Mockito.when(authenticationDao.findByToken(authenticationRecord.authenticationToken()))
               .thenReturn(Optional.of(authenticationRecord));

        RecordId userId = userAuthorizationView.handle(authorizationQuery);

        assertWithMessage("UserAuthorizationView failed")
                .that(userId)
                .isEqualTo(authenticationRecord.userId());

    }

    @Test
    @DisplayName("Should throw an UnauthorizedUserException if there is no authenticated user with this token")
    void shouldFailByIncorrectToken() {

        UserAuthorizationQuery authorizationQuery =
                new UserAuthorizationQuery("token");

        AuthenticationDao authenticationDao = Mockito.mock(AuthenticationDao.class);

        UserAuthorizationView userAuthorizationView =
                new UserAuthorizationViewImpl(authenticationDao);

        Mockito.when(authenticationDao.findByToken(authorizationQuery.authorizationToken()))
               .thenReturn(Optional.empty());

        assertThrows(UserAuthorizationException.class, () -> {
            userAuthorizationView.handle(authorizationQuery);
        }, "UserAuthorizationView passed without valid token");

    }

    @Test
    @DisplayName("Should throw an UnauthorizedUserException if token expired")
    void shouldFailByExpiredToken() {
        AuthenticationRecord authenticationRecord = new AuthenticationRecord(
                new RecordId("token"),
                "token",
                LocalDateTime.now(LocalDateTimeUtil.TIME_ZONE)
                             .minusDays(1),
                new RecordId("recordId"));

        UserAuthorizationQuery authorizationQuery =
                new UserAuthorizationQuery(authenticationRecord.authenticationToken());

        AuthenticationDao authenticationDao = Mockito.mock(AuthenticationDao.class);

        UserAuthorizationView userAuthorizationView =
                new UserAuthorizationViewImpl(authenticationDao);

        Mockito.when(authenticationDao.findByToken(authenticationRecord.authenticationToken()))
               .thenReturn(Optional.of(authenticationRecord));

        assertThrows(UserAuthorizationException.class, () -> {
            userAuthorizationView.handle(authorizationQuery);
        }, "UserAuthorizationView passed with expired token");

    }

}
