// Tema
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

// Verificar tema salvo
const savedTheme = localStorage.getItem('algori-theme') || 'light';
if (savedTheme === 'dark') {
    body.classList.add('dark-theme');
    updateThemeIcon(true);
}

// Alternar tema
themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark-theme');
    localStorage.setItem('algori-theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
});

function updateThemeIcon(isDark) {
    themeToggle.innerHTML = isDark ? `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/>
            <line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/>
            <line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
    ` : `
        <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
    `;
}

// Modais
const aboutBtn = document.getElementById('about-btn');
const aboutModal = document.getElementById('about-modal');

aboutBtn.addEventListener('click', () => {
    aboutModal.classList.add('active');
});

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Fechar modal ao clicar fora
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
});

// Fechar modal com ESC
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
        });
    }
});

// Tabs
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        // Encontrar o container de tabs mais próximo
        const tabsContainer = btn.closest('.tabs');
        const contentContainer = tabsContainer.nextElementSibling;
        
        // Remover active de todos os botões deste container
        tabsContainer.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        // Encontrar e esconder todos os tab-content subsequentes
        let sibling = contentContainer;
        while (sibling && !sibling.classList.contains('tabs')) {
            if (sibling.classList.contains('tab-content')) {
                sibling.classList.remove('active');
            }
            sibling = sibling.nextElementSibling;
        }
        
        // Adicionar active ao clicado e mostrar conteúdo
        btn.classList.add('active');
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add('active');
        }
    });
});

// Copiar código
function copyCode(button) {
    const codeBlock = button.closest('.code-block, .example-card');
    const code = codeBlock.querySelector('code');
    const text = code.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        button.classList.add('copied');
        
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar:', err);
    });
}

// Navegação ativa
const sections = document.querySelectorAll('section[id]');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const navMainLinks = document.querySelectorAll('.nav-main-link');

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Atualizar navegação no scroll
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    navMainLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Pesquisa
const searchInput = document.querySelector('.search-input');
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
searchResults.style.cssText = 'display:none;position:absolute;top:100%;left:0;right:0;background:var(--bg-body);border:1px solid var(--border);border-radius:var(--radius);max-height:300px;overflow-y:auto;z-index:100;margin-top:4px;';
if (searchInput) {
    searchInput.parentElement.style.position = 'relative';
    searchInput.parentElement.appendChild(searchResults);

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const results = [];
        const allSections = document.querySelectorAll('section[id], h2, h3, .inline-code, p, td');

        allSections.forEach(el => {
            const text = el.textContent.toLowerCase();
            if (text.includes(query)) {
                let title = '';
                let href = '';
                let snippet = el.textContent.substring(0, 80).trim();

                if (el.tagName === 'SECTION') {
                    title = el.querySelector('h2')?.textContent || el.id;
                    href = '#' + el.id;
                } else if (el.tagName === 'H2' || el.tagName === 'H3') {
                    title = el.textContent;
                    const section = el.closest('section[id]');
                    if (section) href = '#' + section.id;
                } else if (el.classList.contains('inline-code')) {
                    title = el.textContent;
                    const section = el.closest('section[id]');
                    if (section) href = '#' + section.id;
                } else {
                    const section = el.closest('section[id]');
                    if (section) {
                        title = section.querySelector('h2')?.textContent || section.id;
                        href = '#' + section.id;
                    }
                }

                if (href && !results.find(r => r.href === href && r.title === title)) {
                    results.push({ title, href, snippet });
                }
            }
        });

        if (results.length > 0) {
            searchResults.innerHTML = results.slice(0, 8).map(r =>
                `<a href="${r.href}" class="search-result-item" style="display:block;padding:10px 16px;color:var(--text-primary);text-decoration:none;border-bottom:1px solid var(--border);font-size:13px;transition:background 0.15s;">
                    <div style="font-weight:600;margin-bottom:2px;">${r.title}</div>
                    <div style="color:var(--text-muted);font-size:11px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${r.snippet}</div>
                </a>`
            ).join('');
            searchResults.style.display = 'block';

            searchResults.querySelectorAll('.search-result-item').forEach(item => {
                item.addEventListener('mouseenter', () => item.style.background = 'var(--bg-hover)');
                item.addEventListener('mouseleave', () => item.style.background = 'transparent');
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const href = item.getAttribute('href');
                    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    searchResults.style.display = 'none';
                    searchInput.value = '';
                });
            });
        } else {
            searchResults.innerHTML = '<div style="padding:12px 16px;color:var(--text-muted);font-size:13px;">Nenhum resultado encontrado</div>';
            searchResults.style.display = 'block';
        }
    });

    searchInput.addEventListener('blur', () => {
        setTimeout(() => { searchResults.style.display = 'none'; }, 200);
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchResults.style.display = 'none';
            searchInput.value = '';
        }
    });
}

console.log('Algori Documentation carregada com sucesso!');