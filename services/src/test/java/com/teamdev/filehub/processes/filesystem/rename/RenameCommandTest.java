package com.teamdev.filehub.processes.filesystem.rename;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import org.junit.jupiter.api.Test;

class RenameCommandTest {

    @Test
    void nullTest() {

        var tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(RenameCommand.class);

    }

}
