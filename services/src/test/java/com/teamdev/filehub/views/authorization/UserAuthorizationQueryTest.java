package com.teamdev.filehub.views.authorization;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class UserAuthorizationQueryTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.testAllPublicConstructors(UserAuthorizationQuery.class);

    }

}
