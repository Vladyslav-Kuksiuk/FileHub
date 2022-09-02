package com.teamdev.filehub.dao.user;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class UserRecordTest {

    @Test
    void nullTest() {
        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<String>("user"));
        tester.testAllPublicConstructors(UserRecord.class);
    }
}