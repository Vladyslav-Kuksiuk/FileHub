const form = document.getElementsByTagName("form")[0];

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const inputs = form.getElementsByTagName("input");

    [...inputs].forEach(input => console.log(input.id +': '+ input.value));
})

