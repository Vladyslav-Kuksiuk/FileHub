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

class LoadFolderRouteTest {

    private final Gson gson = new Gson();

    private final RecordId userId = new RecordId("userId");
    private final RecordId folderId = new RecordId("folderId");

    @Mock
    private Request request;

    @Mock
    private Response response;

    @Mock
    private UserAuthorizationView authView;

    LoadFolderRouteTest() {
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

        tester.testAllPublicConstructors(LoadFolderRoute.class);

    }

    @Test
    @DisplayName("Should set FolderInfo as JSON string in response body")
    void testHandleWithoutExceptions() {

        var folderInfo = new FolderInfo("Folder", folderId.value(), "parentFolderId");
        var responseJsonString = gson.toJson(folderInfo);

        Mockito.when(response.body())
               .thenReturn(responseJsonString);

        var folderInfoView = new FolderInfoView() {

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

        var route = new LoadFolderRoute(authView, folderInfoView);

        assertWithMessage("Route handle did not return folder info")
                .that(route.handle(request, response))
                .isEqualTo(responseJsonString);
        Mockito.verify(response, Mockito.times(1))
               .body(responseJsonString);

    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set 403 response status")
    void testHandleWithAccessDeniedException() {

        var errorMessage = "errorMessage";

        var folderInfoView = new FolderInfoView() {

            @Override
            public FolderInfo handle(FolderInfoQuery query) throws AccessDeniedException {
                throw new AccessDeniedException(errorMessage);
            }
        };

        var route = new LoadFolderRoute(authView, folderInfoView);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch DataNotFountException and set 404 response status")
    void testHandleWithDataNotFoundException() {

        var errorMessage = "errorMessage";

        var folderInfoView = new FolderInfoView() {

            @Override
            public FolderInfo handle(FolderInfoQuery query) throws DataNotFoundException {
                throw new DataNotFoundException(errorMessage);
            }
        };

        var route = new LoadFolderRoute(authView, folderInfoView);

        assertWithMessage("Route handle did not return error message")
                .that(route.handle(request, response))
                .isEqualTo(errorMessage);
        Mockito.verify(response, Mockito.times(1))
               .status(404);

    }

}
