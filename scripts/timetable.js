import { getCurrentMinutes, timeToMinutes } from './utils.js';
import { getTodayName } from './utils.js';
import { renderNextLessonCard } from './lessonCard.js';

let cachedData = null;

/**
 * Load timetable once from server
 */
export async function loadTimetable() {
    const response = await fetch('/data/timetable.json', {
        cache: 'no-store'
    });

    cachedData = await response.json();

    renderTimetable(cachedData);
}

/**
 * Initial render (runs once)
 */
export function renderTimetable(data) {

    const today = getTodayName();

    renderNextLessonCard(data.days[today]);

    const container = document.getElementById('accordion');
    container.innerHTML = '';

    for (const [day, lessons] of Object.entries(data.days)) {

        const details = document.createElement('details');
        const summary = document.createElement('summary');

        summary.textContent = day;

        if (day === today) {
            details.open = true;
        }

        details.appendChild(summary);

        lessons.forEach(lesson => {

            const div = document.createElement('div');
            div.className = 'lesson';

            div.dataset.start = lesson.start;
            div.dataset.end = lesson.end;

            div.innerHTML = `
                <time class="time">${lesson.start} - ${lesson.end}</time>
                <div class="info">
                    <h2 class="subject">${lesson.subject}</h2>
                    <p class="room">${lesson.room} • ${lesson.teacher}</p>
                </div>
            `;

            applyLessonState(div);

            details.appendChild(div);
        });

        container.appendChild(details);
    }
}

/**
 * Refresh ONLY time-based UI (fast, lightweight)
 */
export function refreshTimetableUI() {

    if (!cachedData) return;

    const today = getTodayName();

    renderNextLessonCard(cachedData.days[today]);

    document.querySelectorAll('.lesson').forEach(applyLessonState);
}

/**
 * Apply current/completed/upcoming state to a lesson row
 */
function applyLessonState(el) {

    const currentMinutes = getCurrentMinutes();

    const startMinutes = timeToMinutes(el.dataset.start);
    const endMinutes = timeToMinutes(el.dataset.end);

    el.classList.remove('current', 'completed', 'upcoming');

    if (currentMinutes > endMinutes) {
        el.classList.add('completed');
    } else if (
        currentMinutes >= startMinutes &&
        currentMinutes <= endMinutes
    ) {
        el.classList.add('current');
    } else {
        el.classList.add('upcoming');
    }
}