import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/archivo';
import '@fontsource-variable/bodoni-moda/wght.css';
import '@fontsource-variable/bodoni-moda/wght-italic.css';
import '@fontsource/instrument-serif/400.css';
import '@fontsource/instrument-serif/400-italic.css';
import { releasePageTriggers } from './lib/gsap';
import './styles/tokens.css';
import './styles/global.css';
import './styles/ui.css';
import App from './App';
import './styles/redesign.css';
import './styles/redesign-pages.css';

// Browser back/forward does not go through the delegated click cleanup in
// ScrollManager. Release any pinned ScrollTrigger nodes before React Router
// starts unmounting the old route, or the removed pin wrapper can leave React
// holding a child whose parent has changed.
window.addEventListener('popstate', releasePageTriggers);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
