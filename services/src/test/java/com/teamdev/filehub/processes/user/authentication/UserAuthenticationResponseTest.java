package com.teamdev.filehub.processes.user.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class UserAuthenticationResponseTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "FN458FB847BF");
        tester.setDefault(RecordId.class, new RecordId("123"));
        tester.testAllPublicConstructors(UserAuthenticationResponse.class);

    }

}
