package com.teamdev.database.user;

import com.google.common.testing.NullPointerTester;
import com.google.common.truth.Truth;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthorizationDataTest {

    @Test
    void createAuthorizationDataTest() {

        AuthorizationData authorizationData = new AuthorizationData("user",
                                                                    "BF487GW87FB4W874FO8W7WB4F",
                                                                    1661011835);

        Truth.assertWithMessage("User id reading failed.")
             .that(authorizationData.userId())
             .matches("user");

        Truth.assertWithMessage("Authentication token reading failed.")
             .that(authorizationData.authenticationToken())
             .matches("BF487GW87FB4W874FO8W7WB4F");

        Truth.assertWithMessage("Authorization time reading failed.")
             .that(authorizationData.authorizationTime())
             .isEqualTo(1661011835);

    }

    @Test
    void invalidUserIdTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthorizationData userData = new AuthorizationData("",
                                                               "BF487GW87FB4W874FO8W7WB4F",
                                                               1661011835);
        }, "User authorization data creation with illegal userId passed.");

    }

    @Test
    void invalidTokenTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthorizationData userData = new AuthorizationData("user",
                                                               "",
                                                               1661011835);
        }, "User authorization data creation with illegal authentication token passed.");

    }

    @Test
    void invalidTimeTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthorizationData userData = new AuthorizationData("user",
                                                               "BF487GW87FB4W874FO8W7WB4F",
                                                               -2);
        }, "User authorization data creation with illegal authorization time passed.");

    }

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "VGF847VF487VF48");
        tester.testAllPublicConstructors(AuthorizationData.class);

    }
}