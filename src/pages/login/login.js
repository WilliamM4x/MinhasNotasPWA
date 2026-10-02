function switchAuthTab(mode) {
    const isRegister = mode === 'register';
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const fieldName = document.getElementById('field-name');
    const rowRemember = document.getElementById('row-remember');
    const buttonLabel = document.getElementById('button-label');

    if (isRegister) {
      tabRegister.className = "flex-1 py-2 rounded-full font-label-md text-label-md text-on-primary bg-primary-container transition-all duration-200";
      tabLogin.className = "flex-1 py-2 rounded-full font-label-md text-label-md text-secondary transition-all duration-200";
      fieldName.classList.remove('hidden');
      fieldName.classList.add('flex');
      rowRemember.classList.add('hidden');
      rowRemember.classList.remove('flex');
      buttonLabel.textContent = "Cadastrar";
    } else {
      tabLogin.className = "flex-1 py-2 rounded-full font-label-md text-label-md text-on-primary bg-primary-container transition-all duration-200";
      tabRegister.className = "flex-1 py-2 rounded-full font-label-md text-label-md text-secondary transition-all duration-200";
      fieldName.classList.add('hidden');
      fieldName.classList.remove('flex');
      rowRemember.classList.remove('hidden');
      rowRemember.classList.add('flex');
      buttonLabel.textContent = "Acessar minha agenda";
    }
  }

  function togglePasswordVisibility() {
    const passwordInput = document.getElementById('input-password');
    const eyeIcon = document.getElementById('password-eye-icon');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      eyeIcon.textContent = 'visibility_off';
    } else {
      passwordInput.type = 'password';
      eyeIcon.textContent = 'visibility';
    }
  }