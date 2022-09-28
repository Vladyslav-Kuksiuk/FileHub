export function validateInputLength(inputId, minLength){
    return new Promise((resolve, reject)=>{
        const input = document.getElementById(inputId);

        if(input.value.length >= minLength){
            resolve(`Input ${inputId} length validated successfully!`)
        }else {
            reject(`Input ${inputId} length validation failed!`)
        }
    })
}

export function validateInputByRegex(inputId, regex){
    return new Promise((resolve, reject)=>{
        const input = document.getElementById(inputId);

        if (input.value.match(regex)) {
            resolve(`Input ${inputId} regex validated successfully!`)
        } else{
            reject(`Input ${inputId} regex validation failed!`)
        }
    })
}

export function validateSameInputsValue(firstInputId, secondInputId){
    return new Promise((resolve, reject)=>{
        const firstInput = document.getElementById(firstInputId);
        const secondInput = document.getElementById(secondInputId);

        if (firstInput.value === secondInput.value) {
            resolve(`Inputs '${firstInputId}' and '${secondInputId} are same!`)
        } else{
            reject(`Inputs '${firstInputId}' and '${secondInputId} not match!'`)
        }
    })
}