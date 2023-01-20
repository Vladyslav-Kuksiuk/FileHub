package com.teamdev.filehub.dao.user;

import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.user.UserData;
import com.teamdev.filehub.user.UserTable;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;

class InMemoryUserDaoTest {

    private final UserRecord USER_RECORD = new UserRecord(new RecordId<>("real_user"),
                                                          "real_user",
                                                          "real_password");
    private final UserData USER_DATA = new UserData("real_user",
                                                    "real_user",
                                                    "real_password");
    @Mock
    private UserTable userTable;
    private UserDao userDao;

    public InMemoryUserDaoTest() {

        MockitoAnnotations.openMocks(this);
        userDao = new InMemoryUserDao(userTable);
    }

    @Test
    void findTest() {

        given(userTable.findById(USER_RECORD.id()
                                            .value()))
                .willReturn(Optional.of(USER_DATA));

        assertWithMessage("Find user by id failed.")
                .that(userDao.find(USER_RECORD.id())
                             .get()
                             .login())
                .isEqualTo(USER_RECORD.login());
    }

    @Test
    void findAbsentUserTest() {

        given(userTable.findById(USER_RECORD.id()
                                            .value()))
                .willReturn(Optional.empty());

        assertWithMessage("Find absent user by id failed.")
                .that(userDao.find(USER_RECORD.id())
                             .isEmpty())
                .isTrue();

    }

    @Test
    void createTest() {

        userDao.create(USER_RECORD);

        verify(userTable).create(USER_DATA);

    }

    @Test
    void createExistingUserTest() {

        doThrow(new RuntimeException("Data already exists.")).when(userTable)
                .create(USER_DATA);

        assertThrows(RuntimeException.class, () -> userDao.create(USER_RECORD));

    }

    @Test
    void updateTest() {

        userDao.update(USER_RECORD);

        verify(userTable).update(USER_DATA);

    }

    @Test
    void updateAbsentUserTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(userTable)
                                                            .update(USER_DATA);

        assertThrows(RuntimeException.class, () -> userDao.update(USER_RECORD));

    }

    @Test
    void deleteTest() {

        userDao.delete(USER_RECORD.id());

        verify(userTable).delete(USER_DATA.id());

    }

    @Test
    void deleteAbsentUserTest() {

        doThrow(new RuntimeException("Data doesn't exist.")).when(userTable)
                                                            .delete(USER_DATA.id());

        assertThrows(RuntimeException.class, () -> userDao.delete(USER_RECORD.id()));

    }

}
