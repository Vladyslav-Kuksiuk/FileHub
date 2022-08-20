package com.teamdev.services.authorization;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.Test;

class UserAuthorizationCommandTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "FN458FB847BF");
        tester.testAllPublicConstructors(UserAuthorizationCommand.class);

    }

}