function goToWalletPage() {
  showPage("wallet-page");
}
let mnemonic = "";
function toggleSecret() {
  const secret = document.getElementById("secret-display");
  const realPhrase = document.getElementById("mnemonic-output").innerText;

  secret.innerText = secret.innerText === "Hidden" ? realPhrase : "Hidden";
}
function togglePrivateKey(coin, index, actualPrivateKey) {
  const elem = document.getElementById(`priv-${coin}-${index}`);
  elem.innerText = elem.innerText === "Hidden" ? actualPrivateKey : "Hidden";
}

async function generateAccount() {
  const coin = document.getElementById("coin-select").value;
  const walletList = document.getElementById("wallet-accounts");
  const index = walletList.children.length;

  let response = await axios.post(
    "http://localhost:3000/user/generate_coin",
    {
        mnemonic,
        coin
    }, 
    {
      headers: {
        token: localStorage.getItem("user_token"),
      },
    }
  );

  const publicKey = response.data.Pub_Key;
  const privateKey = response.data.Priv_Key;

  const wrapper = document.createElement("div");
  wrapper.classList.add("wallet-entry");

  wrapper.innerHTML = `
      <strong>Coin:</strong> ${coin} <br>
      <strong>Account Index:</strong> ${index} <br>
      <strong>Public Key:</strong> <code>${publicKey}</code> <br>
      <strong>Private Key:</strong> 
      <code id="priv-${coin}-${index}">Hidden</code> 
      <button onclick="togglePrivateKey('${coin}', ${index}, '${privateKey}')">Show</button>
      <hr>
    `;

  walletList.appendChild(wrapper);
}

function logout() {
  localStorage.removeItem("currentUser");
  mnemonic = "";
  location.reload();
}

function showPage(id) {
  document
    .querySelectorAll(".page")
    .forEach((el) => el.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

let authMode = "signup";

function setMode(mode) {
  authMode = mode;

  document.getElementById("form-heading").innerText =
    mode === "signup" ? "Signup" : "Login";

  // Set button styles
  document.getElementById("signup-btn").classList.remove("active");
  document.getElementById("login-btn").classList.remove("active");

  if (mode === "signup") {
    document.getElementById("signup-btn").classList.add("active");
  } else {
    document.getElementById("login-btn").classList.add("active");
  }
}

async function handleAuth() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    if (authMode === "signup") {
      const response = await axios.post("http://localhost:3000/user/signup", {
        email: username,
        password,
      });
      const user_token = response.data.token;
      mnemonic = response.data.mnemonic;
      document.getElementById("user-name").innerText = username;
      document.getElementById("mnemonic-output").innerText = mnemonic;

      showPage("phrase-page");
    } else if(authMode == "login") {
        const response = await axios.post("http://localhost:3000/user/login", {
          email: username,
          password,
        });
        const user_token = response.data.token;
        mnemonic = response.data.mnemonic;
        document.getElementById("user-name").innerText = username;
        document.getElementById("mnemonic-output").innerText = mnemonic;
        localStorage.setItem('user_token',user_token);
        goToWalletPage();
    }
  } catch (err) {
    if (err.response && err.response.status === 403) {
      alert("User Already Exists");
    } else if (err.response && err.response.data && err.response.data.err) {
      alert(err.response.data.err);
    } else {
      alert("Something went wrong");
      console.error(err);
    }
  }
}

window.onload = function () {
  const user = localStorage.getItem("currentUser");
  if (user) {
    document.getElementById("user-name").innerText = user;
    showPage("wallet-page"); 
  } else {
    showPage("auth-page");
  }
};
