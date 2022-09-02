package com.teamdev.filehub.dao.authentication;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class AuthenticationRecordTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<String>("user"));
        tester.testAllPublicConstructors(AuthenticationRecord.class);
    }

}