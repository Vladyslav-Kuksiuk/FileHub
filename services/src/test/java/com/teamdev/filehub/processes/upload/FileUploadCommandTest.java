package com.teamdev.filehub.processes.upload;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.file.upload.FileUploadCommand;
import org.junit.jupiter.api.Test;

class FileUploadCommandTest {

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(RecordId.class, new RecordId<>("user"));
        tester.testAllPublicConstructors(FileUploadCommand.class);

    }

}
