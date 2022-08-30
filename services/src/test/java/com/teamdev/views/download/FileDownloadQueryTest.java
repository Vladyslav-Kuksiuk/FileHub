package com.teamdev.views.download;

import com.google.common.testing.NullPointerTester;
import com.teamdev.persistent.dao.RecordId;
import org.junit.jupiter.api.Test;

class FileDownloadQueryTest {

    @Test
    void nullTest() throws NoSuchMethodException {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(FileDownloadQuery.class);

    }

}