package com.teamdev.processes.logout;

import com.google.common.testing.NullPointerTester;
import com.teamdev.processes.logout.UserLogoutCommand;
import org.junit.jupiter.api.Test;

class UserLogoutCommandTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "123");
        tester.testAllPublicConstructors(UserLogoutCommand.class);

    }

}