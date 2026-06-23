import { getCurrentMinutes, timeToMinutes } from './utils.js';

export function renderNextLessonCard(lessons) {

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

        let countdown = hours > 0
            ? `${hours}h ${minutes}m`
            : `${minutes} min`;

        card.className = 'next';

        card.innerHTML = `
            <h2>Next Lesson</h2>

            <div class="subject">${nextLesson.subject}</div>

            <p>${nextLesson.start} - ${nextLesson.end}</p>

            <p>${nextLesson.room} • ${nextLesson.teacher}</p>

            <div class="countdown">Starts in ${countdown}</div>
        `;

        return;
    }

    card.className = '';
    card.innerHTML = `
        <h2>School Day Complete 🎉</h2>
        <p>No more lessons today.</p>
    `;
}