import {validateInputByRegex, validateInputLength, validateSameInputsValue} from "./validations.js";
import {
    CONFIRM_PASSWORD,
    EMAIL,
    EMAIL_MIN_LENGTH,
    EMAIL_VALIDATION_REGEX,
    PASSWORD,
    PASSWORD_MIN_LENGTH
} from "./constants.js";

const form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (
        validateInputLength(EMAIL, EMAIL_MIN_LENGTH) &&
        validateInputLength(PASSWORD, PASSWORD_MIN_LENGTH) &&
        validateInputByRegex(EMAIL, EMAIL_VALIDATION_REGEX) &&
        validateSameInputsValue(PASSWORD, CONFIRM_PASSWORD)
    ) {
        console.log("Registration passed successfully!")
    } else {
        console.log("Registration failed :(")
    }

})