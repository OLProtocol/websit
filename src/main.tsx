import ReactDOM from 'react-dom/client';
import '@/locales';
import App from '@/App';
import 'react-photo-view/dist/react-photo-view.css';
import '@/style/tailwind.css';
import '@/style/index.css';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    // <React.StrictMode>
      <App /> as any
    // </React.StrictMode>
);
