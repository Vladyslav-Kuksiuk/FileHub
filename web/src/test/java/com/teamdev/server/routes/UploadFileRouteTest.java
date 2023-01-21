package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.upload.FileUploadCommand;
import com.teamdev.filehub.processes.filesystem.upload.FileUploadProcess;
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

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.Part;
import java.io.IOException;
import java.util.List;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.mockito.ArgumentMatchers.any;

class UploadFileRouteTest {

    private final Gson gson = new Gson();

    private final RecordId userId = new RecordId("userId");
    private final RecordId folderId = new RecordId("folderId");

    @Mock
    private Request request;

    @Mock
    private Response response;

    @Mock
    private UserAuthorizationView authView;

    UploadFileRouteTest() {
        MockitoAnnotations.openMocks(this);
    }

    @BeforeEach
    void setUp() throws UserAuthorizationException {
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn(folderId.value());
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(authView.handle(any()))
               .thenReturn(userId);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(UploadFileRoute.class);

    }

    @Test
    @DisplayName("Should set uploaded files ids as JSON string in response body")
    void testHandleWithoutExceptions() throws ServletException, IOException {

        var inputStream = Mockito.mock(ServletInputStream.class);

        var uploadCommand = new FileUploadCommand(
                userId,
                folderId,
                "fileName",
                "fileMimetype",
                123123,
                inputStream);

        var fileId = new RecordId("fileId");

        var raw = Mockito.mock(HttpServletRequest.class);
        var part = Mockito.mock(Part.class);

        Mockito.when(request.raw())
               .thenReturn(raw);
        Mockito.when(raw.getParts())
               .thenReturn(List.of(part));

        Mockito.when(part.getInputStream())
               .thenReturn(inputStream);
        Mockito.when(part.getSubmittedFileName())
               .thenReturn(uploadCommand.name());
        Mockito.when(part.getContentType())
               .thenReturn(uploadCommand.mimetype());
        Mockito.when(part.getSize())
               .thenReturn(uploadCommand.size());

        var responseBody = List.of(fileId.value());
        var responseJsonString = gson.toJson(responseBody);

        Mockito.when(response.body())
               .thenReturn(responseJsonString);

        var fileUploadProcess = new FileUploadProcess() {

            @Override
            public RecordId handle(FileUploadCommand command) {

                assertWithMessage("Command is different")
                        .that(command)
                        .isEqualTo(uploadCommand);

                return fileId;
            }
        };

        var route = new UploadFileRoute(authView, fileUploadProcess);

        assertWithMessage("Route handle did not return folder info")
                .that(route.handle(request, response))
                .isEqualTo(responseJsonString);
        Mockito.verify(response, Mockito.times(1))
               .body(responseJsonString);

    }

    @Test
    @DisplayName("Should catch IOException and set 500 response status")
    void testHandleWithIOException() throws ServletException, IOException {

        var errorMessage = "errorMessage";

        var raw = Mockito.mock(HttpServletRequest.class);

        Mockito.when(request.raw())
               .thenReturn(raw);
        Mockito.when(raw.getParts())
               .thenThrow(new IOException(errorMessage));

        var route = new UploadFileRoute(authView, Mockito.mock(FileUploadProcess.class));

        route.handle(request, response);

        Mockito.verify(response, Mockito.times(1))
               .body(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(500);

    }

    @Test
    @DisplayName("Should handle DataNotFoundException(404 status) and AccessDeniedException(403 status)")
    void testHandleWithDataNotFoundException() throws ServletException, IOException {

        var errorMessage = "errorMessage";

        var raw = Mockito.mock(HttpServletRequest.class);
        var part = Mockito.mock(Part.class);
        var inputStream = Mockito.mock(ServletInputStream.class);

        Mockito.when(request.raw())
               .thenReturn(raw);
        Mockito.when(raw.getParts())
               .thenReturn(List.of(part));

        Mockito.when(part.getInputStream())
               .thenReturn(inputStream);
        Mockito.when(part.getSubmittedFileName())
               .thenReturn("name");
        Mockito.when(part.getContentType())
               .thenReturn("mimetype");
        Mockito.when(part.getSize())
               .thenReturn(123L);

        var processWithDataException = new FileUploadProcess() {

            @Override
            public RecordId handle(FileUploadCommand command) throws DataNotFoundException {

                throw new DataNotFoundException(errorMessage);
            }
        };

        var route = new UploadFileRoute(authView, processWithDataException);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(404);

        Mockito.reset(response);

        var processWithAccessException = new FileUploadProcess() {

            @Override
            public RecordId handle(FileUploadCommand command) throws AccessDeniedException {

                throw new AccessDeniedException(errorMessage);
            }
        };

        route = new UploadFileRoute(authView, processWithAccessException);

        assertWithMessage("Route handle did not return an error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch ServletException and set 404 response status")
    void testHandleWithServletException() throws ServletException, IOException {

        var errorMessage = "errorMessage";

        var raw = Mockito.mock(HttpServletRequest.class);

        Mockito.when(request.raw())
               .thenReturn(raw);
        Mockito.when(raw.getParts())
               .thenThrow(new ServletException(errorMessage));

        var route = new UploadFileRoute(authView, Mockito.mock(FileUploadProcess.class));

        route.handle(request, response);

        Mockito.verify(response, Mockito.times(1))
               .body(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(400);

    }

}
