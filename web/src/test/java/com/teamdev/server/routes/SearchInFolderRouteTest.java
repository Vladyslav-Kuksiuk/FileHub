package com.teamdev.server.routes;

import com.google.common.testing.NullPointerTester;
import com.google.gson.Gson;
import com.teamdev.filehub.AccessDeniedException;
import com.teamdev.filehub.DataNotFoundException;
import com.teamdev.filehub.dao.RecordId;
import com.teamdev.filehub.views.authorization.UserAuthorizationException;
import com.teamdev.filehub.views.authorization.UserAuthorizationView;
import com.teamdev.filehub.views.folder.FolderContent;
import com.teamdev.filehub.views.folder.FolderItem;
import com.teamdev.filehub.views.folder.search.FolderSearchQuery;
import com.teamdev.filehub.views.folder.search.FolderSearchView;
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

class SearchInFolderRouteTest {

    private final Gson gson = new Gson();

    private final RecordId<String> userId = new RecordId<>("userId");
    private final RecordId<String> folderId = new RecordId<>("folderId");
    private final String searchWord = "searchWord";

    @Mock
    private Request request;

    @Mock
    private Response response;

    @Mock
    private UserAuthorizationView authView;

    @Mock
    private FolderSearchView searchView;

    SearchInFolderRouteTest() {
        MockitoAnnotations.openMocks(this);
    }

    @BeforeEach
    void setUp() throws UserAuthorizationException {
        Mockito.when(request.headers("Authorization"))
               .thenReturn("Bearer token");
        Mockito.when(request.params(":id"))
               .thenReturn(folderId.value());
        Mockito.when(request.params(":searchWord"))
               .thenReturn(searchWord);
        Mockito.when(request.contentType())
               .thenReturn("application/json");
        Mockito.when(authView.handle(any()))
               .thenReturn(userId);
    }

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor params")
    void testNullPointer() {

        var tester = new NullPointerTester();

        tester.testAllPublicConstructors(SearchInFolderRoute.class);

    }

    @Test
    @DisplayName("Should set searched FolderContent as JSON string in response body")
    void testHandleWithoutExceptions() throws DataNotFoundException, AccessDeniedException {

        var folderContent = new FolderContent();

        folderContent.addItem(new FolderItem(
                "myFolderId",
                folderId.value(),
                "searchNameFolder"));

        var query = new FolderSearchQuery(
                userId,
                folderId,
                searchWord);

        Mockito.when(searchView.handle(query))
               .thenReturn(folderContent);

        var route = new SearchInFolderRoute(authView, searchView);

        route.handle(request, response);

        Mockito.verify(response, Mockito.times(1))
               .body(gson.toJson(folderContent));

    }

    @Test
    @DisplayName("Should catch AccessDeniedException and set response status 403")
    void testHandleWithAccessDeniedException() throws DataNotFoundException,
                                                      AccessDeniedException {

        var errorMessage = "errorMessage";

        Mockito.when(searchView.handle(any()))
               .thenThrow(new AccessDeniedException(errorMessage));

        var route = new SearchInFolderRoute(authView, searchView);

        assertThat(route.handle(request, response)).isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(403);

    }

    @Test
    @DisplayName("Should catch DataNotFoundException and set response status 403")
    void testHandleWithDataNotFoundException() throws DataNotFoundException,
                                                      AccessDeniedException {

        var errorMessage = "errorMessage";

        Mockito.when(searchView.handle(any()))
               .thenThrow(new DataNotFoundException(errorMessage));

        var route = new SearchInFolderRoute(authView, searchView);

        assertThat(route.handle(request, response)).isEqualTo(errorMessage);

        Mockito.verify(response, Mockito.times(1))
               .status(404);

    }

}
