package com.teamdev.filehub.processes.logout;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class UserLogoutCommandTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(UserLogoutCommand.class);

    }

}
