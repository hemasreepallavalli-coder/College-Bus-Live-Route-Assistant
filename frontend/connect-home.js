const button = document.querySelector(".btn");

if (button) {
  button.addEventListener("click", (event) => {
    event.preventDefault();

    window.location.href = "/admin";
  });
}