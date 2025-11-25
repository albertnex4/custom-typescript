import { createRoot } from 'react-dom/client';
import {App,startEvents} from './App';
import './styles.css';

//startEvents();

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);