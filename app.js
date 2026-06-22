async function loadTimetable() {
    const response = await fetch('/timetable.json');
    const data = await response.json();

    const container = document.getElementById('accordion');

    for (const [day, lessons] of Object.entries(data.days)) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');

        summary.textContent = day;
        details.appendChild(summary);

        lessons.forEach(lesson => {
            const div = document.createElement('div');
            div.className = 'lesson';

            div.innerHTML = `
        <div class="time">${lesson.start} - ${lesson.end}</div>
        <div class="subject">${lesson.subject}</div>
        <div class="room">${lesson.room} • ${lesson.teacher}</div>
      `;

            details.appendChild(div);
        });

        container.appendChild(details);
    }
}

// Register SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
}

// Request notification permission
async function enableNotifications() {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
}

// Example notification
function notifyLesson(subject) {
    if (Notification.permission === 'granted') {
        new Notification('Lesson starting', {
            body: subject
        });
    }
}

// Install prompt handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // You can hook this to a button later
    console.log('Install prompt available');
});

function sendSWNotification(title, body) {
    navigator.serviceWorker.ready.then(reg => {
        reg.active.postMessage({
            type: 'NOTIFY',
            title,
            body
        });
    });
}

loadTimetable();