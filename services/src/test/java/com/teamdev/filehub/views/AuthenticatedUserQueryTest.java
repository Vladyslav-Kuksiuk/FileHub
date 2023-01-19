package com.teamdev.filehub.views;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class AuthenticatedUserQueryTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(AuthenticatedUserQuery.class);

    }

}
