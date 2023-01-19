package com.teamdev.filehub.views.userprofile;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class UserProfileQueryTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(UserProfileQuery.class);

    }

}
