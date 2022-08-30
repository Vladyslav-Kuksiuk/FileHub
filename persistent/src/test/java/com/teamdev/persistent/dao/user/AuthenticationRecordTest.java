package com.teamdev.persistent.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.RecordId;
import com.teamdev.persistent.dao.authentication.AuthenticationRecord;
import org.junit.jupiter.api.Test;

class AuthenticationRecordTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(AuthenticationRecord.class);

    }

}