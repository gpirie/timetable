import { getCurrentMinutes, timeToMinutes } from './utils.js';
import { getTodayName } from './utils.js';
import { renderNextLessonCard } from './lessonCard.js';

export async function loadTimetable() {

    const response = await fetch('/data/timetable.json');
    const data = await response.json();

    const today = getTodayName();

    renderNextLessonCard(data.days[today]);

    const container = document.getElementById('accordion');

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