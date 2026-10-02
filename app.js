/**
 * Verifica se o navegador suporta Service Worker e registra sw.js
 */


if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => {
      console.log("Service Worker registrado!");
    })
    .catch((err) => {
      console.log("Erro ao registrar no navegador:" + err);
    });
} else {
  console.log("Este navegador não suporta Service Worker");
}

/**
 * Lida com o evento de instalação do Service Worker
 */

const installButton = document.getElementById("installButton");
let deferredPrompt; //guardar o evento para exibir o prompt de instalação mais tarde


if (installButton) {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installButton.hidden = false;
  });
  installButton.addEventListener("click", async () => { 
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`Usuário ${outcome} a instalação do PWA`);
    deferredPrompt = null; // corrigido com 2 'r'
    installButton.hidden = true;
  });
}
