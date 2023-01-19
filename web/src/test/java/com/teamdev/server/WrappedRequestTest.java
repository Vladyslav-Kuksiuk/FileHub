package com.teamdev.server;

import com.google.common.testing.NullPointerTester;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import spark.Request;

class WrappedRequestTest {

    @Test
    @DisplayName("Should throw NullPointerException on null in constructor and methods params")
    void testNullPointer() {

        NullPointerTester tester = new NullPointerTester();

        tester.testAllPublicConstructors(JsonEntity.class);

        tester.setDefault(Object.class, new Object());

        tester.testInstanceMethods(new WrappedRequest(Mockito.mock(Request.class)),
                                   NullPointerTester.Visibility.PUBLIC);

    }

    @Test
    @DisplayName("Should create WrappedRequest even if the request body is empty")
    void testConstructorRequestWithoutBody() {

        var request = Mockito.mock(Request.class);
        Mockito.when(request.body())
               .thenReturn(null);

        WrappedRequest wrappedRequest = new WrappedRequest(request);
    }

}
