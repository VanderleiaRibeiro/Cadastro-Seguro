const API_BASE = "/file";

function el(id) {
  return document.getElementById(id);
}

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const uploadSection = document.getElementById("uploadSection");
const authSection = document.getElementById("authSection");
const enviarBtn = document.getElementById("enviarBtn");
const arquivoInput = document.getElementById("arquivoInput");
const messageBox = document.getElementById("messageBox");
const welcomeMsg = document.getElementById("welcomeMsg");
const logoutBtn = document.getElementById("logoutBtn");
const adminSection = document.getElementById("adminSection");
const delBtn = document.getElementById("delBtn");
const delFilename = document.getElementById("delFilename");
const adminMsg = document.getElementById("adminMsg");

function showMessage(box, text, type = "success") {
  box.textContent = text;
  box.className = "message-box " + type;
  box.style.display = "block";
  setTimeout(() => {
    box.style.display = "none";
  }, 5000);
}

function updateUI() {
  const token = localStorage.getItem("token");
  if (token) {
    authSection.style.display = "none";
    uploadSection.style.display = "block";
    const role = localStorage.getItem("role") || "user";
    welcomeMsg.textContent =
      "Logado como: " +
      (localStorage.getItem("username") || "Usuário") +
      " (" +
      role +
      ")";
    if (role === "admin") adminSection.style.display = "block";
    else adminSection.style.display = "none";
  } else {
    authSection.style.display = "block";
    uploadSection.style.display = "none";
    adminSection.style.display = "none";
  }
}

registerForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const form = new FormData(registerForm);
  const body = Object.fromEntries(form.entries());
  try {
    const res = await fetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok) showMessage(messageBox, "Registrado! Faça login.", "success");
    else showMessage(messageBox, data.message || "Erro", "error");
  } catch (err) {
    showMessage(messageBox, "Erro de conexão", "error");
  }
});

loginForm.addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const form = new FormData(loginForm);
  const body = Object.fromEntries(form.entries());
  try {
    const res = await fetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role || "user");
      localStorage.setItem("username", body.username);
      showMessage(messageBox, "Login efetuado!", "success");
      updateUI();
    } else {
      showMessage(messageBox, data.message || "Credenciais inválidas", "error");
    }
  } catch (err) {
    showMessage(messageBox, "Erro de conexão", "error");
  }
});

logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("username");
  updateUI();
});

enviarBtn.addEventListener("click", enviarArquivos);

async function enviarArquivos() {
  messageBox.style.display = "none";
  enviarBtn.disabled = true;
  enviarBtn.textContent = "Enviando...";
  try {
    const arquivos = arquivoInput.files;
    if (!arquivos || arquivos.length === 0) {
      showMessage(messageBox, "Nenhum arquivo selecionado", "alert");
      return;
    }
    // 2. Criar FormData
    const formData = new FormData();
    // 3. Loop
    for (const arquivo of arquivos) {
      formData.append("meusArquivos", arquivo);
    }
    // 4. Ler token
    const token = localStorage.getItem("token");
    if (!token) {
      showMessage(
        messageBox,
        "Você precisa estar logado para enviar.",
        "alert"
      );
      return;
    }
    // 5. fetch
    const res = await fetch(API_BASE + "/upload", {
      method: "POST",
      body: formData,
      headers: { Authorization: "Bearer " + token },
    });
    const data = await res.json();
    if (res.ok) showMessage(messageBox, data.message || "Upload OK", "success");
    else showMessage(messageBox, data.message || "Erro no upload", "error");
  } catch (err) {
    console.error(err);
    showMessage(messageBox, "Erro de conexão", "error");
  } finally {
    enviarBtn.disabled = false;
    enviarBtn.textContent = "Enviar Arquivos";
  }
}

delBtn &&
  delBtn.addEventListener("click", async () => {
    const filename = delFilename.value.trim();
    if (!filename)
      return showMessage(adminMsg, "Informe o nome do arquivo", "alert");
    const token = localStorage.getItem("token");
    if (!token)
      return showMessage(
        adminMsg,
        "Você precisa estar logado como admin",
        "alert"
      );
    try {
      const res = await fetch(API_BASE + "/" + encodeURIComponent(filename), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      const data = await res.json();
      if (res.ok) showMessage(adminMsg, data.message || "Deletado", "success");
      else showMessage(adminMsg, data.message || "Erro", "error");
    } catch (err) {
      showMessage(adminMsg, "Erro de conexão", "error");
    }
  });

updateUI();
