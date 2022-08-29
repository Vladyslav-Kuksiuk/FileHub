package com.teamdev.processes.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.RecordId;
import org.junit.jupiter.api.Test;

class UserAuthenticationResponseTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "FN458FB847BF");
        tester.setDefault(RecordId.class, new RecordId<>("123"));
        tester.testAllPublicConstructors(UserAuthenticationResponse.class);

    }

}