import { loadTimetable } from './timetable.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';

registerServiceWorker();
setupInstallPrompt();

loadTimetable();