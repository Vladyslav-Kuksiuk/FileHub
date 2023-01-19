package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.content.FolderContentQuery;
import com.teamdev.filehub.views.folder.content.FolderContentView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.mockito.ArgumentMatchers.any;

class LoadFolderContentRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(LoadFolderContentRoute.class);

    }

    @Test
    @DisplayName("Should set FolderContent as JSON string in response body")
    void testHandleWithoutExceptions() throws UserAuthorizationException {

        var folderId = "folderId";

        var folderContent = new FolderContent();
        var responseJsonString = gson.toJson(folderContent);

        var request = Mockito.mock(Request.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn(folderId);

        var response = Mockito.mock(Response.class);
        Mockito.when(response.body())
               .thenReturn(responseJsonString);

        var authView = Mockito.mock(UserAuthorizationView.class);
        Mockito.when(authView.handle(any()))
               .thenReturn(new RecordId<>("userId"));

        var folderContentView = new FolderContentView() {

            @Override
            public FolderContent handle(FolderContentQuery query) {
                if (!query.folderId()
                          .value()
                          .equals(folderId)) {
                    throw new RuntimeException("");
                }
                return folderContent;
            }
        };

        var route = new LoadFolderContentRoute(authView, folderContentView);

        assertWithMessage("Route handle did not return folder content")
                .that(route.handle(request, response))
                .isEqualTo(responseJsonString);
        Mockito.verify(response, Mockito.times(1))
               .body(responseJsonString);

    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set 403 response status")
    void testHandleWithAccessDeniedException() throws UserAuthorizationException {

        var errorMessage = "errorMessage";

        var request = Mockito.mock(Request.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn("folderId");

        var response = Mockito.mock(Response.class);

        var authView = Mockito.mock(UserAuthorizationView.class);
        Mockito.when(authView.handle(any()))
               .thenReturn(new RecordId<>("userId"));

        var folderContentView = new FolderContentView() {

            @Override
            public FolderContent handle(FolderContentQuery query) throws AccessDeniedException {
                throw new AccessDeniedException(errorMessage);
            }
        };

        var route = new LoadFolderContentRoute(authView, folderContentView);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set 403 response status")
    void testHandleWithDataNotFoundException() throws UserAuthorizationException {

        var errorMessage = "errorMessage";

        var request = Mockito.mock(Request.class);
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn("folderId");

        var response = Mockito.mock(Response.class);

        var authView = Mockito.mock(UserAuthorizationView.class);
        Mockito.when(authView.handle(any()))
               .thenReturn(new RecordId<>("userId"));

        var folderContentView = new FolderContentView() {

            @Override
            public FolderContent handle(FolderContentQuery query) throws DataNotFoundException {
                throw new DataNotFoundException(errorMessage);
            }
        };

        var route = new LoadFolderContentRoute(authView, folderContentView);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(404);

    }

}
