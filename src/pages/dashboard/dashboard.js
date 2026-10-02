// Filtro ativo
let currentFilter = 'all';
let editingTaskId = null;

// 1. Renderiza todas as tarefas vindas do IndexedDB
async function renderTasks() {
  const notes = await getAllNotes();
  const tasksList = document.getElementById('tasksList');
  if (!tasksList) return;

  // Limpa a lista antes de renderizar
  tasksList.innerHTML = '';

  notes.forEach((note) => {
    const isDone = note.status === 'concluida' || note.status === 'concluido' || note.status === 'done';
    const card = document.createElement('div');
    card.className = `task-card group bg-surface-container-lowest p-4 rounded-xl shadow-sm transition-all hover:shadow-md flex items-start gap-4 ${isDone ? 'is-completed' : ''}`;
    card.dataset.status = isDone ? 'done' : 'pending';
    const todayStr = new Date().toISOString().split('T')[0];
    const isToday = note.scheduledDate ? note.scheduledDate.startsWith(todayStr) : false;
    card.dataset.date = isToday ? 'today' : 'other';
    card.dataset.id = note.id;

    // Formata a data agendada (YYYY-MM-DD ou ISO) para visualização amigável
    let displayDate = 'Sem prazo';
    if (note.scheduledDate) {
      if (note.scheduledDate.includes('-') && !note.scheduledDate.includes('T')) {
        const [year, month, day] = note.scheduledDate.split('-');
        displayDate = `${day}/${month}/${year}`;
      } else {
        displayDate = new Date(note.scheduledDate).toLocaleDateString('pt-BR');
      }
    } else if (note.createdAt) {
      displayDate = new Date(note.createdAt).toLocaleDateString('pt-BR');
    }

    card.innerHTML = `
      <button class="task-checkbox mt-1 w-5 h-5 rounded-full ${isDone ? 'bg-primary' : 'bg-surface-container-lowest'} flex items-center justify-center transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary/30" aria-label="Marcar como concluída">
        <span class="material-symbols-outlined text-[14px] text-white ${isDone ? 'opacity-100' : 'opacity-0'} transition-opacity">check</span>
      </button>
      <div class="flex-1 min-w-0">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <h3 class="font-title-sm text-title-sm ${isDone ? 'line-through text-outline' : 'text-on-surface'} task-title">${note.title}</h3>
          <div class="flex items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${isDone ? 'bg-primary/10 text-primary font-medium' : 'bg-surface-container text-on-surface-variant'} capitalize">${note.status || 'pendente'}</span>
            <span class="font-body-sm text-body-sm text-outline flex items-center gap-1">
              <span class="material-symbols-outlined text-[14px]">event</span>
              ${displayDate}
            </span>
          </div>
        </div>
        <p class="font-body-md text-body-md text-on-surface-variant mt-1 line-clamp-1">${note.content || 'Sem descrição'}</p>
        <div class="flex items-center justify-between mt-3 pt-2">
          <span class="px-2 py-0.5 rounded-lg bg-surface-container-low ${isDone ? 'text-primary' : 'text-secondary'} font-label-sm text-label-sm capitalize">${note.status || 'pendente'}</span>
          <div class="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
            <button class="btn-edit p-1.5 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors" title="Editar">
              <span class="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <button class="btn-delete p-1.5 rounded-lg hover:bg-error-container hover:text-error text-on-surface-variant transition-colors" title="Excluir">
              <span class="material-symbols-outlined text-[18px]">delete</span>
            </button>
          </div>
        </div>
      </div>
    `;

    bindTaskEvents(card, note);
    tasksList.appendChild(card);
  });

  updateMetrics();
  applyFilter(currentFilter);
}

// 2. Conecta os eventos de cada Card (Concluir e Excluir no Dexie)
function bindTaskEvents(card, note) {
  const checkbox = card.querySelector('.task-checkbox');
  const deleteBtn = card.querySelector('.btn-delete');
  const editBtn = card.querySelector('.btn-edit');

  if (checkbox) {
    checkbox.onclick = async () => {
      const isDone = card.classList.toggle('is-completed');
      const newStatus = isDone ? 'concluido' : 'pendente';

      // Atualiza o status no IndexedDB
      if (note && note.id) await updateNote(note.id, { status: newStatus });

      await renderTasks();
    };
  }

  if (deleteBtn) {
    deleteBtn.onclick = async () => {
      // Deleta do IndexedDB
      if (note && note.id) await deleteNote(note.id);
      await renderTasks();
    };
  }

  // Editar Título e Conteúdo
  if (editBtn) {
    editBtn.onclick = () => {
      openEditModal(note);
    };
  }
}

// 3. Atualiza os números no topo da Dashboard
function updateMetrics() {
  const tasksList = document.getElementById('tasksList');
  if (!tasksList) return;

  const allCards = tasksList.querySelectorAll('.task-card');
  const doneCards = tasksList.querySelectorAll('.task-card.is-completed');
  const total = allCards.length;
  const done = doneCards.length;
  const pending = total - done;

  const metricTotal = document.getElementById('metricTotal');
  const metricPending = document.getElementById('metricPending');
  const metricDone = document.getElementById('metricDone');

  if (metricTotal) metricTotal.textContent = total;
  if (metricPending) metricPending.textContent = pending;
  if (metricDone) metricDone.textContent = done;
}

// 4. Aplica os filtros (Todas / Hoje / Pendentes / Concluídas)
function applyFilter(filter) {
  currentFilter = filter;
  const tasksList = document.getElementById('tasksList');
  if (!tasksList) return;

  const cards = tasksList.querySelectorAll('.task-card');

  cards.forEach(card => {
    const status = card.dataset.status;
    let matchFilter = true;

    if (filter === 'pending') matchFilter = status === 'pending';
    else if (filter === 'done') matchFilter = status === 'done';
    else if (filter === 'today') matchFilter = card.dataset.date === 'today';

    card.style.display = matchFilter ? 'flex' : 'none';
  });
}

// 5. Inicialização da Dashboard e eventos dos botões
function initDashboard() {
  const modal = document.getElementById('modalNewTask');
  const btnOpenModal = document.getElementById('btnOpenNewTaskModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnSaveModal = document.getElementById('btnSaveTaskModal');
  const modalTitle = document.getElementById('modalInputTitle');
  const modalDesc = document.getElementById('modalInputDesc');
  const modalScheduledDate = document.getElementById('modalInputScheduledDate');
  const modalStatus = document.getElementById('modalInputStatus');
  const filterBtns = document.querySelectorAll('.filter-btn');

  // Funções do Modal
  function openModal() {
    editingTaskId = null;
    const modalHeading = modal ? modal.querySelector('h3') : null;
    if (modalHeading) modalHeading.textContent = 'Nova Tarefa';
    
    modal.classList.remove('hidden');
    if (modalTitle) {
      modalTitle.value = '';
      modalTitle.focus();
    }
    if (modalDesc) modalDesc.value = '';
    if (modalScheduledDate) modalScheduledDate.value = new Date().toISOString().split('T')[0];
    if (modalStatus) modalStatus.value = 'pendente';
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      if (modalTitle) modalTitle.value = '';
      if (modalDesc) modalDesc.value = '';
      if (modalScheduledDate) modalScheduledDate.value = '';
      if (modalStatus) modalStatus.value = 'pendente';
    }
  }

  window.openEditModal = function (note) {
    editingTaskId = note.id; // Modo edição com o ID da tarefa
    const modalHeading = modal ? modal.querySelector('h3') : null;
    if (modalHeading) modalHeading.textContent = 'Editar Tarefa';
    modal.classList.remove('hidden');
    if (modalTitle) {
      modalTitle.value = note.title;
      modalTitle.focus();
    }
    if (modalDesc) modalDesc.value = note.content || '';
    if (modalScheduledDate) {
      modalScheduledDate.value = note.scheduledDate 
        ? (note.scheduledDate.includes('T') ? note.scheduledDate.split('T')[0] : note.scheduledDate)
        : new Date().toISOString().split('T')[0];
    }
    if (modalStatus) {
      modalStatus.value = note.status || 'pendente';
    }
  };

  if (btnOpenModal) btnOpenModal.onclick = openModal;
  if (btnCloseModal) btnCloseModal.onclick = closeModal;
  if (btnCancelModal) btnCancelModal.onclick = closeModal;

  // SALVAR VIA MODAL
  if (btnSaveModal) {
    btnSaveModal.onclick = async () => {
      const titleVal = modalTitle.value.trim();
      if (!titleVal) return;
      const descVal = modalDesc.value.trim() || 'Sem descrição adicional.';
      const statusVal = modalStatus ? modalStatus.value : 'pendente';
      const scheduledDateVal = modalScheduledDate && modalScheduledDate.value 
        ? modalScheduledDate.value 
        : new Date().toISOString().split('T')[0];

      if (editingTaskId) {
        // ATUALIZA NO INDEXEDDB
        await updateNote(editingTaskId, {
          title: titleVal,
          content: descVal,
          status: statusVal,
          scheduledDate: scheduledDateVal
        });
      } else {
        // CRIA NOVO NO INDEXEDDB
        await addNote(titleVal, descVal, statusVal, scheduledDateVal);
      }
      closeModal();
      await renderTasks();
    };
  }

  // Botões de filtro
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-primary', 'text-on-primary');
        b.classList.add('bg-surface-container-low', 'text-on-surface-variant');
      });
      btn.classList.add('bg-primary', 'text-on-primary');
      btn.classList.remove('bg-surface-container-low', 'text-on-surface-variant');
      applyFilter(btn.dataset.filter);
    });
  });

  // Atualiza a exibição da data de hoje no cabeçalho
  updateCurrentDateDisplay();

  // Render inicial das notas salvas no banco
  renderTasks();
}

// Formata e exibe a data atual 
function updateCurrentDateDisplay() {
  const dateEl = document.getElementById('currentDateDisplay');
  if (!dateEl) return;
  const now = new Date();
  const formatted = now.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });
  dateEl.textContent = formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

// Inicia quando o script carrega
initDashboard();

