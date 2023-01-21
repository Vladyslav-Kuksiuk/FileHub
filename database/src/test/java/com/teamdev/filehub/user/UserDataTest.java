package com.teamdev.filehub.user;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class UserDataTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(UserData.class);
    }
}
