package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.foldercreate.FolderCreateCommand;
import com.teamdev.filehub.processes.foldercreate.FolderCreateProcess;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.mockito.ArgumentMatchers.any;

class CreateFolderRouteTest {

    private final RecordId<String> userId = new RecordId<>("userId");
    private final RecordId<String> parentFolderId = new RecordId<>("parentFolderId");

    @Mock
    private Request request;

    @Mock
    private Response response;

    @Mock
    private UserAuthorizationView authView;

    CreateFolderRouteTest() {
        MockitoAnnotations.openMocks(this);
    }

    @BeforeEach
    void setUp() throws UserAuthorizationException {
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn(parentFolderId.value());
        Mockito.when(authView.handle(any()))
               .thenReturn(new RecordId<>("userId"));
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(CreateFolderRoute.class);

    }

    @Test
    @DisplayName("Should set created folder id as string in response body")
    void testHandleWithoutExceptions() {

        var folderName = "folderName";

        Mockito.when(request.body())
               .thenReturn(
                       "{\"parentId\":\"" + parentFolderId.value() + "\",\"name\":\"" + folderName +
                               "\"}");

        var createdFolderId = new RecordId<>("createdFolderId");

        Mockito.when(response.body())
               .thenReturn(createdFolderId.value());

        var folderCreateProcess = new FolderCreateProcess() {

            @Override
            public RecordId<String> handle(FolderCreateCommand command) {

                assertWithMessage("Command user id is different.")
                        .that(command.userId())
                        .isEqualTo(userId);

                assertWithMessage("Command folder id is different.")
                        .that(command.parentFolderId())
                        .isEqualTo(parentFolderId);

                assertWithMessage("Command folder name is different.")
                        .that(command.folderName())
                        .isEqualTo(folderName);

                return createdFolderId;
            }
        };

        var route = new CreateFolderRoute(authView, folderCreateProcess);

        assertWithMessage("Route handle did not return created folder id")
                .that(route.handle(request, response))
                .isEqualTo(createdFolderId.value());

        Mockito.verify(response, Mockito.times(1))
               .body(createdFolderId.value());

    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set 403 response status")
    void testHandleWithAccessDeniedException() {

        var errorMessage = "errorMessage";

        Mockito.when(request.body())
               .thenReturn(
                       "{\"parentId\":\"" + parentFolderId.value() + "\",\"name\":\"folderName\"}");

        var folderCreateProcess = new FolderCreateProcess() {

            @Override
            public RecordId<String> handle(FolderCreateCommand command)
                    throws AccessDeniedException {

                throw new AccessDeniedException(errorMessage);
            }
        };

        var route = new CreateFolderRoute(authView, folderCreateProcess);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch RequestFieldValidationException and set 422 response status")
    void testHandleWithDataNotFoundException() {

        Mockito.when(request.body())
               .thenReturn(
                       "{\"parentId\":\"" + parentFolderId.value() +
                               "\",\"name\":\"<Not valid name>\"}");

        var folderCreateProcess = new FolderCreateProcess() {
            @Override
            public RecordId<String> handle(FolderCreateCommand command) {
                return null;
            }
        };

        var route = new CreateFolderRoute(authView, folderCreateProcess);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo("Folder name invalid.");
        Mockito.verify(response, Mockito.times(1))
               .status(422);

    }

}
