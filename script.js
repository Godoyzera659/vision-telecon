const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('.nav-links');
menuButton.addEventListener('click', () => {
  const open = menu.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelectorAll('.brand, .footer-brand').forEach(logo => {
  logo.addEventListener('click', event => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

document.getElementById('year').textContent = new Date().getFullYear();
const revealElements = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { rootMargin: '0px 0px 120px', threshold: 0.05 });
  revealElements.forEach(element => observer.observe(element));
} else {
  revealElements.forEach(element => element.classList.add('visible'));
}

document.querySelectorAll('.comparison').forEach(comparison => {
  const range = comparison.querySelector('.comparison-range');
  let animationFrame;
  const updateComparison = () => {
    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(() => comparison.style.setProperty('--position', `${range.value}%`));
  };
  range.addEventListener('input', updateComparison);
  updateComparison();
});

const filterButtons = document.querySelectorAll('.filter-button');
const serviceCards = document.querySelectorAll('.service-card[data-service]');
const projectItems = document.querySelectorAll('.gallery-item[data-category]');
const projectSummary = document.getElementById('project-summary');
const projectEmpty = document.getElementById('project-empty');
const projectsSection = document.getElementById('projetos');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const categoryNames = {
  todos: 'todos os serviços',
  cabeamento: 'cabeamento estruturado',
  fibra: 'fibra óptica',
  certificacao: 'certificação de pontos',
  eletrica: 'elétrica básica',
  cftv: 'CFTV'
};

function filterProjects(category, scrollToProjects = false) {
  let visibleCount = 0;

  projectItems.forEach(item => {
    const categories = item.dataset.category.split(' ');
    const visible = category === 'todos' || categories.includes(category);
    item.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  filterButtons.forEach(button => {
    const active = button.dataset.filter === category;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  serviceCards.forEach(card => {
    const active = card.dataset.service === category;
    card.classList.toggle('active', active);
    card.setAttribute('aria-pressed', String(active));
  });

  projectEmpty.hidden = visibleCount > 0;
  projectSummary.textContent = visibleCount === 0
    ? `Conheça nossas soluções em ${categoryNames[category]}.`
    : `${visibleCount} ${visibleCount === 1 ? 'trabalho realizado' : 'trabalhos realizados'} em ${categoryNames[category]}.`;

  if (scrollToProjects) {
    projectsSection.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
  }
}

filterButtons.forEach(button => {
  button.addEventListener('click', () => filterProjects(button.dataset.filter));
});

serviceCards.forEach(card => {
  const openService = () => filterProjects(card.dataset.service, true);
  card.addEventListener('click', openService);
  card.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openService();
    }
  });
});

filterProjects('todos');
