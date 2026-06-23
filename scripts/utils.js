export function timeToMinutes(time) {
    const [hours, minutes] = time.split(':').map(Number);
    return (hours * 60) + minutes;
}

export function getCurrentMinutes() {
    const now = new Date();
    return (now.getHours() * 60) + now.getMinutes();
}

export function getTodayName() {
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

    if (day === 'Saturday' || day === 'Sunday') {
        day = 'Monday';
    }

    return day;
}