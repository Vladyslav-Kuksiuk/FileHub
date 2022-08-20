package com.teamdev.persistent.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.RecordIdentifier;
import org.junit.jupiter.api.Test;

class AuthenticationRecordTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordIdentifier.class, new RecordIdentifier<>("user"));
        tester.testAllPublicConstructors(AuthenticationRecord.class);

    }

}