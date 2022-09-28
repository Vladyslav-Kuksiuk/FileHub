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

    Promise.allSettled([
        validateInputLength(EMAIL, EMAIL_MIN_LENGTH),
        validateInputLength(PASSWORD, PASSWORD_MIN_LENGTH)
    ]).then((results) => {

        let hasError = false;

        results.forEach(result =>{
            if(result.status === "fulfilled"){
                console.log(result.value);
            }else {
                console.log(result.reason);
                hasError = true;
            }
        })

        if(hasError){
            console.log("Authorization failed!");
        }else{
            console.log("Authorization passed successfully!");
        }
    })

})