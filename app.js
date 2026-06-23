async function loadTimetable() {
    const response = await fetch('/timetable.json');
    const data = await response.json();

    const today = getTodayName();

    renderNextLessonCard(data.days[today]);

    const container = document.getElementById('accordion');

    for (const [day, lessons] of Object.entries(data.days)) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');

        if (day === today) {
            details.open = true;
        }

        summary.textContent = day;
        details.appendChild(summary);

        lessons.forEach(lesson => {

            console.log(lesson);

            const div = document.createElement('div');
            div.className = 'lesson';

            div.innerHTML = `
                <time class="time">${lesson.start} - ${lesson.end}</time>
                <div class="info">
                    <h2 class="subject">${lesson.subject}</h2>
                    <p class="room">${lesson.room} • ${lesson.teacher}</p>
                </div>
              `;

            const currentMinutes = getCurrentMinutes();

            const startMinutes = timeToMinutes(lesson.start);
            const endMinutes = timeToMinutes(lesson.end);

            if (currentMinutes > endMinutes) {
                div.classList.add('completed');
            }
            else if (
                currentMinutes >= startMinutes &&
                currentMinutes <= endMinutes
            ) {
                div.classList.add('current');
            }
            else {
                div.classList.add('upcoming');
            }

            details.appendChild(div);
        });

        container.appendChild(details);
    }
}

// Register SW
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js');
}

// Install prompt handling
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    // You can hook this to a button later
    console.log('Install prompt available');
});

loadTimetable();

function renderNextLessonCard(lessons) {

    const card = document.querySelector('.next-lesson-card');

    const currentMinutes = getCurrentMinutes();

    let nextLesson = null;

    for (const lesson of lessons) {

        const startMinutes = timeToMinutes(lesson.start);

        if (startMinutes > currentMinutes) {
            nextLesson = lesson;
            break;
        }
    }

    if (nextLesson) {

        const remaining =
            timeToMinutes(nextLesson.start) - currentMinutes;

        const hours = Math.floor(remaining / 60);
        const minutes = remaining % 60;

        let countdown = '';

        if (hours > 0) {
            countdown = `${hours}h ${minutes}m`;
        } else {
            countdown = `${minutes} min`;
        }

        card.className = 'next';

        card.innerHTML = `
            <h2>Next Lesson</h2>

            <div class="subject">
                ${nextLesson.subject}
            </div>

            <p>
                ${nextLesson.start} - ${nextLesson.end}
            </p>

            <p>
                ${nextLesson.room} • ${nextLesson.teacher}
            </p>

            <div class="countdown">
                Starts in ${countdown}
            </div>
        `;

        return;
    }

    card.className = '';

    card.innerHTML = `
        <h2>School Day Complete 🎉</h2>
        <p>No more lessons today.</p>
    `;
}

// Days of the week
function getTodayName() {
    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
    ];

    let day = days[new Date().getDay()];

    // Weekend -> Monday
    if (day === 'Saturday' || day === 'Sunday') {
        day = 'Monday';
    }

    return day;
}

function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
}

function getCurrentMinutes() {
    const now = new Date();
    return (now.getHours() * 60) + now.getMinutes();
}