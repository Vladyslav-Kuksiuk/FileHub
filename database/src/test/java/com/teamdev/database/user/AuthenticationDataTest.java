package com.teamdev.database.user;

import com.google.common.testing.NullPointerTester;
import com.google.common.truth.Truth;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertThrows;

class AuthenticationDataTest {

    @Test
    void createAuthorizationDataTest() {

        AuthenticationData authenticationData = new AuthenticationData("user",
                                                                       "BF487GW87FB4W874FO8W7WB4F",
                                                                       1661011835);

        Truth.assertWithMessage("User id reading failed.")
             .that(authenticationData.userId())
             .matches("user");

        Truth.assertWithMessage("Authentication token reading failed.")
             .that(authenticationData.authenticationToken())
             .matches("BF487GW87FB4W874FO8W7WB4F");

        Truth.assertWithMessage("Authorization time reading failed.")
             .that(authenticationData.authorizationTime())
             .isEqualTo(1661011835);

    }

    @Test
    void invalidUserIdTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthenticationData userData = new AuthenticationData("",
                                                                 "BF487GW87FB4W874FO8W7WB4F",
                                                                 1661011835);
        }, "User authorization data creation with illegal userId passed.");

    }

    @Test
    void invalidTokenTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthenticationData userData = new AuthenticationData("user",
                                                                 "",
                                                                 1661011835);
        }, "User authorization data creation with illegal authentication token passed.");

    }

    @Test
    void invalidTimeTest() {

        assertThrows(IllegalStateException.class, () -> {
            AuthenticationData userData = new AuthenticationData("user",
                                                                 "BF487GW87FB4W874FO8W7WB4F",
                                                                 -2);
        }, "User authorization data creation with illegal authorization time passed.");

    }

    @Test
    void nullTest() {

        NullPointerTester tester = new NullPointerTester();
        tester.setDefault(String.class, "VGF847VF487VF48");
        tester.testAllPublicConstructors(AuthenticationData.class);

    }
}