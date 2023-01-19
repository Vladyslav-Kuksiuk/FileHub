package com.teamdev.filehub.processes;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class AuthenticatedUserCommandTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(AuthenticatedUserCommand.class);

    }

}
