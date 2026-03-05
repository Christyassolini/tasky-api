// ==================== Toast Notification System ====================

console.log("Toast.js carregado com sucesso!");

// Criar container de toasts se não existir
function createToastContainer() {
    if (!document.querySelector('.toast-container')) {
        const container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
}

// Função principal para mostrar toast
function showToast(message, type = 'info', duration = 4000) {
    createToastContainer();
    
    const container = document.querySelector('.toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    // Ícones para cada tipo
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    // Títulos para cada tipo
    const titles = {
        success: 'Sucesso!',
        error: 'Erro!',
        warning: 'Atenção!',
        info: 'Informação'
    };
    
    toast.innerHTML = `
        <div class="toast-icon">${icons[type]}</div>
        <div class="toast-content">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    container.appendChild(toast);
    
    // Auto remover após duração
    if (duration > 0) {
        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, duration);
    }
    
    return toast;
}

// Atalhos para tipos específicos
function toastSuccess(message, duration = 4000) {
    return showToast(message, 'success', duration);
}

function toastError(message, duration = 5000) {
    return showToast(message, 'error', duration);
}

function toastWarning(message, duration = 4500) {
    return showToast(message, 'warning', duration);
}

function toastInfo(message, duration = 4000) {
    return showToast(message, 'info', duration);
}

// Substituir alert padrão (opcional)
// window.alert = (message) => toastInfo(message);

// ==================== Modal de Confirmação ====================

/**
 * Mostra um modal de confirmação bonito
 */
function showConfirmModal(message, onConfirm, onCancel) {
    // Criar overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;

    // Criar modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 32px;
        max-width: 400px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        animation: slideUp 0.3s ease;
        font-family: 'Inter', sans-serif;
    `;

    modal.innerHTML = `
        <h2 style="margin: 0 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">Confirmar ação</h2>
        <p style="margin: 0 0 24px 0; color: #6B7280; font-size: 14px; line-height: 1.5;">${message}</p>
        <div style="display: flex; gap: 12px; justify-content: flex-end;">
            <button id="confirm-cancel" style="
                padding: 10px 20px;
                border-radius: 6px;
                border: 1px solid #E5E7EB;
                background: white;
                color: #111827;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            ">Cancelar</button>
            <button id="confirm-ok" style="
                padding: 10px 20px;
                border-radius: 6px;
                border: none;
                background: linear-gradient(135deg, #EF4444, #DC2626);
                color: white;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
            ">Confirmar</button>
        </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Adicionar hover effects
    const okBtn = modal.querySelector('#confirm-ok');
    const cancelBtn = modal.querySelector('#confirm-cancel');

    okBtn.onmouseover = () => okBtn.style.transform = 'scale(1.05)';
    okBtn.onmouseout = () => okBtn.style.transform = 'scale(1)';
    cancelBtn.onmouseover = () => cancelBtn.style.background = '#F3F4F6';
    cancelBtn.onmouseout = () => cancelBtn.style.background = 'white';

    // Event listeners
    okBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => overlay.remove(), 300);
        if (onConfirm) onConfirm();
    });

    cancelBtn.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => overlay.remove(), 300);
        if (onCancel) onCancel();
    });

    // Fechar ao clicar no overlay
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => overlay.remove(), 300);
            if (onCancel) onCancel();
        }
    });

    // Adicionar estilos de animação ao documento se não existir
    if (!document.querySelector('style[data-toast-animations]')) {
        const style = document.createElement('style');
        style.setAttribute('data-toast-animations', 'true');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes slideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}
