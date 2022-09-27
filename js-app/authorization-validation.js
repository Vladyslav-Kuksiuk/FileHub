import {validateInputLength} from "./validations.js";
import {EMAIL, EMAIL_MIN_LENGTH, PASSWORD, PASSWORD_MIN_LENGTH} from "./constants.js";

const form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (
        validateInputLength(EMAIL, EMAIL_MIN_LENGTH) &&
        validateInputLength(PASSWORD, PASSWORD_MIN_LENGTH)
    ) {
        console.log("Authorization passed successfully!")
    } else {
        console.log("Authorization failed :(")
    }

})