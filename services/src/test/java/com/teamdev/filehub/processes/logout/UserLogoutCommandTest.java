package com.teamdev.filehub.processes.logout;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class UserLogoutCommandTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(UserLogoutCommand.class);

    }

}
