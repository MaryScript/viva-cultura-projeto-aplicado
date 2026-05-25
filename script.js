document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modalInscricao');
    const openBtn = document.getElementById('openModal');
    const closeBtn = document.querySelector('.close-btn');
    const form = document.getElementById('formInscricao');
    const cpfInput = document.getElementById('cpf');
    const divSucesso = document.getElementById('modalSucesso');
    const divErro = document.getElementById('modalErro');
    

    // Simulação de banco de dados local para CPFs já inscritos
    const cpfsInscritos = new Set();

    // Máscara para o CPF
    cpfInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        if (value.length > 9) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})/, "$1.$2.$3");
        } else if (value.length > 3) {
            value = value.replace(/(\d{3})(\d{3})/, "$1.$2");
        }
        e.target.value = value;
    });

    // Função simples para validar CPF
    function validarCPF(cpf) {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf === '' || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
        
        let add = 0;
        for (let i = 0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);
        let rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(9))) return false;
        
        add = 0;
        for (let i = 0; i < 10; i++) add += parseInt(cpf.charAt(i)) * (11 - i);
        rev = 11 - (add % 11);
        if (rev === 10 || rev === 11) rev = 0;
        if (rev !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }

    // Abrir modal
    openBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Fechar modal
    const closeModal = () => {
        // Fecha a modal principal
        modal.classList.remove('active');

        // Libera o scroll da página
        document.body.style.overflow = 'auto';

        // Esconde as modais de sucesso e erro
        modalSucesso.classList.remove('active');
        modalErro.classList.remove('active');

        // Mostra novamente o formulário
        form.style.display = 'block';

        // Limpa os campos do formulário
        form.reset();
    };

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

    // Lógica do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const nome = formData.get('nome');
        const cpfRaw = formData.get('cpf');
        const cpfLimpo = cpfRaw.replace(/\D/g, '');

        // Esconde as modais
        modalSucesso.classList.remove('active');
        modalErro.classList.remove('active');

        // Validar formato do CPF
        if (!validarCPF(cpfLimpo)) {
            form.style.display = 'none';
            modalErro.classList.add('active');
            cpfInput.focus();
            return;
        }

        // Verificar se já está inscrito
        if (cpfsInscritos.has(cpfLimpo)) {
            form.style.display = 'none';
            modalErro.classList.add('active');
            document.getElementById('btnTentarNovamente').focus();
            return;
        }

        // Sucesso inscrição
        cpfsInscritos.add(cpfLimpo);
        form.style.display = 'none';
        modalSucesso.classList.add('active');
        document.getElementById('btnFecharSucesso').focus();

        form.reset();

    });

    // Fechar a modal sucesso
    document.getElementById('btnFecharSucesso').addEventListener('click', () => {
        modalSucesso.classList.remove('active');
        form.style.display = 'block';
        closeModal();
    });

    // Tentar se inscrever novamente
    document.getElementById('btnTentarNovamente').addEventListener('click', () => {
        modalErro.classList.remove('active');
        form.style.display = 'block';
    });
});
