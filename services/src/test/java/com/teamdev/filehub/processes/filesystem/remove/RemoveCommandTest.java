package com.teamdev.filehub.processes.filesystem.remove;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.rename.RenameCommand;
import org.junit.jupiter.api.Test;

class RemoveCommandTest {

    @Test
    void nullTest() {

        var tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(RenameCommand.class);

    }

}
