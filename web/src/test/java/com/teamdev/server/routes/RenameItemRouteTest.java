package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.processes.filesystem.rename.RenameCommand;
import com.teamdev.filehub.processes.filesystem.rename.RenameProcess;
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

import static com.google.common.truth.Truth.assertThat;
import static org.mockito.ArgumentMatchers.any;

class RenameItemRouteTest {

    private final RecordId<String> userId = new RecordId<>("userId");
    private final RecordId<String> itemId = new RecordId<>("itemId");
    private final String newName = "newName";

    @Mock
    private Request request;

    @Mock
    private Response response;

    @Mock
    private UserAuthorizationView authView;

    @Mock
    private RenameProcess renameProcess;

    RenameItemRouteTest() {
        MockitoAnnotations.openMocks(this);
    }

    @BeforeEach
    void setUp() throws UserAuthorizationException {
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");

        Mockito.when(request.params(":id"))
               .thenReturn(itemId.value());

        Mockito.when(request.contentType())
               .thenReturn("application/json");

        Mockito.when(request.body())
               .thenReturn("{\"name\":\"" + newName + "\"}");

        Mockito.when(authView.handle(any()))
               .thenReturn(userId);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(RenameItemRoute.class);

    }

    @Test
    @DisplayName("Should call rename process and set renamed item id in response body")
    void testHandleWithoutExceptions() throws DataNotFoundException,
                                              AccessDeniedException {

        var command = new RenameCommand(userId, itemId, newName);

        Mockito.when(renameProcess.handle(command))
               .thenReturn(itemId);

        var route = new RenameItemRoute(authView, renameProcess);

        route.handle(request, response);

        Mockito.verify(response, Mockito.times(1))
               .body(itemId.value());

        Mockito.verify(renameProcess, Mockito.times(1))
               .handle(command);
    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set response status 403")
    void testHandleWithAccessDeniedException() throws DataNotFoundException,
                                                      AccessDeniedException {

        var errorMessage = "errorMessage";

        Mockito.when(renameProcess.handle(any()))
               .thenThrow(new AccessDeniedException(errorMessage));

        var route = new RenameItemRoute(authView, renameProcess);

        assertThat(route.handle(request, response)).isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch DataNotFoundException and set response status 403")
    void testHandleWithDataNotFoundException() throws DataNotFoundException,
                                                      AccessDeniedException {

        var errorMessage = "errorMessage";

        Mockito.when(renameProcess.handle(any()))
               .thenThrow(new DataNotFoundException(errorMessage));

        var route = new RenameItemRoute(authView, renameProcess);

        assertThat(route.handle(request, response)).isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(404);

    }

}
