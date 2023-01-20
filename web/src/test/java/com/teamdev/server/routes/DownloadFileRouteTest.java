package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.download.FileDownloadQuery;
import com.teamdev.filehub.views.download.FileDownloadView;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import spark.Request;
import spark.Response;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;

import static com.google.common.truth.Truth.assertThat;
import static org.mockito.ArgumentMatchers.any;

class DownloadFileRouteTest {

    private final Gson gson = new Gson();

    private final RecordId<String> userId = new RecordId<>("userId");
    private final RecordId<String> fileId = new RecordId<>("folderId");

    @Mock
    private Request request;

    @Mock
    private Response response;

    @Mock
    private UserAuthorizationView authView;

    @Mock
    private FileDownloadView downloadView;

    DownloadFileRouteTest() {
        MockitoAnnotations.openMocks(this);
    }

    @BeforeEach
    void setUp() throws UserAuthorizationException {
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn(fileId.value());
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(authView.handle(any()))
               .thenReturn(userId);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(DownloadFileRoute.class);

    }

    @Test
    @DisplayName("Should set empty file input stream in response output stream")
    void testHandleWithoutExceptions() throws IOException, DataNotFoundException,
                                              AccessDeniedException {

        var inputStream = Mockito.mock(InputStream.class);
        Mockito.when(inputStream.read(any(byte[].class)))
               .thenReturn(-1);

        var outputStream = Mockito.mock(ServletOutputStream.class);

        var raw = Mockito.mock(HttpServletResponse.class);
        Mockito.when(raw.getOutputStream())
               .thenReturn(outputStream);

        Mockito.when(response.raw())
               .thenReturn(raw);

        Mockito.when(downloadView.handle(any()))
               .thenReturn(inputStream);

        var route = new DownloadFileRoute(authView, downloadView);

        route.handle(request, response);

        Mockito.verify(downloadView, Mockito.times(1))
               .handle(new FileDownloadQuery(userId, fileId));

        Mockito.verify(outputStream, Mockito.never())
               .write(any(byte[].class), any(Integer.class), any(Integer.class));

    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set response status 403")
    void testHandleWithAccessDeniedException() throws DataNotFoundException,
                                                      AccessDeniedException {

        var errorMessage = "errorMessage";

        Mockito.when(downloadView.handle(any()))
               .thenThrow(new AccessDeniedException(errorMessage));

        var route = new DownloadFileRoute(authView, downloadView);

        assertThat(route.handle(request, response)).isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch DataNotFoundException and set response status 403")
    void testHandleWithDataNotFoundException() throws DataNotFoundException,
                                                      AccessDeniedException {

        var errorMessage = "errorMessage";

        Mockito.when(downloadView.handle(any()))
               .thenThrow(new DataNotFoundException(errorMessage));

        var route = new DownloadFileRoute(authView, downloadView);

        assertThat(route.handle(request, response)).isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(404);

    }

    @Test
    @DisplayName("Should catch IOException and set response status 500")
    void testHandleWithIOException() throws DataNotFoundException,
                                            AccessDeniedException, IOException {

        var errorMessage = "errorMessage";

        Mockito.when(downloadView.handle(any()))
               .thenReturn(null);

        var raw = Mockito.mock(HttpServletResponse.class);
        Mockito.when(raw.getOutputStream())
               .thenThrow(new IOException(errorMessage));

        Mockito.when(response.raw())
               .thenReturn(raw);

        var route = new DownloadFileRoute(authView, downloadView);

        route.handle(request, response);

        Mockito.verify(response, Mockito.times(1))
               .status(500);
        Mockito.verify(response, Mockito.times(1))
               .body(errorMessage);

    }

}
