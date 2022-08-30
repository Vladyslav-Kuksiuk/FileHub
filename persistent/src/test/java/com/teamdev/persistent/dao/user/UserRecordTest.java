package com.teamdev.persistent.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.RecordId;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class UserRecordTest {

    @Test
    void illegalLoginTest() {

        assertThrows(IllegalStateException.class,
                     () -> {
                         UserRecord userRecord =
                                 new UserRecord(new RecordId<>("user"),
                                                "",
                                                "password",
                                                "email@email.com");
                     },
                     "User record creation with illegal login passed.");

    }

    @Test
    void illegalPasswordTest() {

        assertThrows(IllegalStateException.class,
                     () -> {
                         UserRecord userRecord =
                                 new UserRecord(new RecordId<>("user"),
                                                "user",
                                                "",
                                                "email@email.com");
                     },
                     "User record creation with illegal password passed.");

    }

    @Test
    void illegalEmailTest() {

        assertThrows(IllegalStateException.class,
                     () -> {
                         UserRecord userRecord =
                                 new UserRecord(new RecordId<>("user"),
                                                "user",
                                                "password",
                                                "email.com");
                     },
                     "User record creation with illegal email passed.");

    }

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "email@email.com");
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(UserRecord.class);

    }
}