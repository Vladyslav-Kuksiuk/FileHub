package com.teamdev.filehub.dao.authentication;

import com.teamdev.filehub.authentication.AuthenticationData;
import com.teamdev.filehub.authentication.AuthenticationTable;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

class InMemoryAuthenticationDaoTest {

    private final AuthenticationRecord AUTHENTICATION_RECORD =
            new AuthenticationRecord(
                    new RecordId("auth_id"),
                    "token",
                    LocalDateTime.of(10, 10, 10, 10, 10),
                    new RecordId("user"));
    private final AuthenticationData AUTHENTICATION_DATA =
            new AuthenticationData("auth_id",
                                   "token",
                                   LocalDateTime.of(10, 10, 10, 10, 10)
                                                .toString(),
                                   "user");
    private final AuthenticationDao authenticationDao;
    @Mock
    private AuthenticationTable authenticationTable;

    public InMemoryAuthenticationDaoTest() {
        MockitoAnnotations.openMocks(this);
        authenticationDao = new InMemoryAuthenticationDao(authenticationTable);
    }

    @Test
    void findTest() {

        given(authenticationTable.findById(AUTHENTICATION_RECORD.id()
                                                                    .value()))
                .willReturn(Optional.of(AUTHENTICATION_DATA));

        assertWithMessage("Find authentication by id failed.")
                .that(authenticationDao.find(AUTHENTICATION_RECORD.id())
                                       .get()
                                       .authenticationToken())
                .isEqualTo(AUTHENTICATION_RECORD.authenticationToken());

    }

    @Test
    void findAbsentAuthenticationTest() {

        given(authenticationTable.findById(AUTHENTICATION_RECORD.id()
                                                                .value()))
                .willReturn(Optional.empty());

        assertWithMessage("Find absent authentication by id failed.")
                .that(authenticationDao.find(AUTHENTICATION_RECORD.id())
                                       .isEmpty())
                .isTrue();

    }

    @Test
    void createTest() {

        authenticationDao.create(AUTHENTICATION_RECORD);

        verify(authenticationTable).create(AUTHENTICATION_DATA);

    }

    @Test
    void createExistingAuthenticationTest() {

        doThrow(new RuntimeException("Data already exists.")).when(authenticationTable)
                .create(AUTHENTICATION_DATA);

        assertThrows(RuntimeException.class, () -> authenticationDao.create(AUTHENTICATION_RECORD));

    }

    @Test
    void updateTest() {

        authenticationDao.update(AUTHENTICATION_RECORD);

        verify(authenticationTable).update(AUTHENTICATION_DATA);

    }

    @Test
    void updateAbsentAuthenticationTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(authenticationTable)
                                                            .update(AUTHENTICATION_DATA);

        assertThrows(RuntimeException.class, () -> authenticationDao.update(AUTHENTICATION_RECORD));

    }

    @Test
    void deleteTest() {

        authenticationDao.delete(AUTHENTICATION_RECORD.id());

        verify(authenticationTable).delete(AUTHENTICATION_DATA.id());

    }

    @Test
    void deleteAbsentAuthenticationTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(authenticationTable)
                                                            .delete(AUTHENTICATION_DATA.id());

        assertThrows(RuntimeException.class,
                     () -> authenticationDao.delete(AUTHENTICATION_RECORD.id()));

    }

}
