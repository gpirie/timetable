import { loadTimetable, refreshTimetableUI } from './timetable.js';
import { registerServiceWorker, setupInstallPrompt } from './pwa.js';

registerServiceWorker();
setupInstallPrompt();

/**
 * Boot app
 */
async function init() {
    await loadTimetable();

    startUIClock();
    startServiceWorkerUpdater();
    setupServiceWorkerListener();
}

init();


/**
 * UI clock loop (updates lesson state + next lesson)
 * Uses timeout recursion (more stable than setInterval on iOS)
 */
function startUIClock() {
    refreshTimetableUI();

    setTimeout(startUIClock, 15000); // 15s tick
}


/**
 * Ask SW for updates periodically
 */
function startServiceWorkerUpdater() {
    setInterval(() => {
        navigator.serviceWorker.getRegistration().then(reg => {
            reg?.update();
        });
    }, 60000);
}


/**
 * Handle SW update messages (triggered from service worker)
 */
function setupServiceWorkerListener() {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'SW_UPDATED') {
            window.location.reload();
        }
    });
}