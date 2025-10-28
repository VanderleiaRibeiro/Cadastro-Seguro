const registerForm = document.getElementById("registerForm");
const messageBox = document.getElementById("messageBox");
const submitBtn = document.getElementById("submitBtn");

registerForm.addEventListener("submit", handleRegister);

function displayMessage(message, type) {
  messageBox.textContent = message;
  messageBox.className = `message-box ${type}`;
  messageBox.style.display = "block";

  if (type === "success") {
    setTimeout(() => {
      messageBox.style.display = "none";
    }, 5000);
  }
}

function clearMessage() {
  messageBox.textContent = "";
  messageBox.className = "message-box";
  messageBox.style.display = "none";
}

function setLoading(isLoading) {
  if (isLoading) {
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
  } else {
    submitBtn.disabled = false;
    submitBtn.classList.remove("loading");
  }
}

async function handleRegister(event) {
  event.preventDefault();
  clearMessage();
  setLoading(true);

  try {
    const formData = new FormData(registerForm);
    const userData = {
      username: formData.get("username").trim(),
      email: formData.get("email").trim(),
      password: formData.get("password"),
    };

    if (userData.username.length < 3) {
      displayMessage(
        "Nome de usuário deve ter pelo menos 3 caracteres",
        "error"
      );
      setLoading(false);
      return;
    }

    if (userData.password.length < 6) {
      displayMessage("A senha deve ter pelo menos 6 caracteres", "error");
      setLoading(false);
      return;
    }

    const response = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const result = await response.json();

    if (response.ok) {
      displayMessage("Cadastro realizado com sucesso", "success");
      registerForm.reset();
    } else {
      displayMessage(result.message, "error");
    }
  } catch (error) {
    console.error("Erro:", error);
    displayMessage("Erro de conexão com o servidor", "error");
  } finally {
    setLoading(false);
  }
}

const inputs = registerForm.querySelectorAll("input");
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (messageBox.style.display === "block") {
      clearMessage();
    }
  });
});
