const authorization_form = document.getElementById("authorization-form");

console.log(authorization_form)

authorization_form.addEventListener("submit", (event) =>{
    event.preventDefault();

    let inputs = authorization_form.getElementsByTagName("input");

    [...inputs].forEach(input => console.log(input.value));
})