package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.info.FolderInfo;
import com.teamdev.filehub.views.folder.info.FolderInfoQuery;
import com.teamdev.filehub.views.folder.info.FolderInfoView;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;
import spark.Response;

import static com.google.common.truth.Truth.assertWithMessage;
import static org.mockito.ArgumentMatchers.any;

class LoadFolderRouteTest {

    private final Gson gson = new Gson();

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(LoadFolderRoute.class);

    }

    @Test
    @DisplayName("Should set FolderInfo as JSON string in response body")
    void testHandleWithoutExceptions() throws UserAuthorizationException {

        var folderId = "folderId";

        var folderInfo = new FolderInfo("Folder", folderId, "parentFolderId");
        var responseJsonString = gson.toJson(folderInfo);

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

        var userProfileView = new FolderInfoView() {

            @Override
            public FolderInfo handle(FolderInfoQuery query) {
                if (!query.folderId()
                          .value()
                          .equals(folderInfo.id())) {
                    throw new RuntimeException("");
                }
                return folderInfo;
            }
        };

        var route = new LoadFolderRoute(authView, userProfileView);

        assertWithMessage("Route handle did not return folder info")
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

        var userProfileView = new FolderInfoView() {

            @Override
            public FolderInfo handle(FolderInfoQuery query) throws AccessDeniedException {
                throw new AccessDeniedException(errorMessage);
            }
        };

        var route = new LoadFolderRoute(authView, userProfileView);

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

        var userProfileView = new FolderInfoView() {

            @Override
            public FolderInfo handle(FolderInfoQuery query) throws DataNotFoundException {
                throw new DataNotFoundException(errorMessage);
            }
        };

        var route = new LoadFolderRoute(authView, userProfileView);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(404);

    }

}
