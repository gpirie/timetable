import { loadTimetable, refreshTimetableUI } from './timetable.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';

registerServiceWorker();
setupInstallPrompt();

/**
 * Boot app
 */
async function init() {
    await loadTimetable();
}

init();

/**
 * Lightweight UI refresh loop (DO NOT reload data)
 */
setInterval(() => {
    refreshTimetableUI();
}, 30000);

navigator.serviceWorker.addEventListener('message', (event) => {
    if (event.data?.type === 'SW_UPDATED') {
        window.location.reload();
    }
});