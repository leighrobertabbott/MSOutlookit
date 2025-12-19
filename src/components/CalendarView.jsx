import React, { useState, useMemo } from 'react';
import { useTheme } from '../ThemeContext';
import './CalendarView.css';

function CalendarView({ onClose, posts = [] }) {
    const { settings } = useTheme();
    const today = new Date();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(today);
    const [viewMode, setViewMode] = useState('Work Week'); // Day, Work Week, Week, Month

    // Get the week containing the current date
    const getWeekDates = (date) => {
        const day = date.getDay();
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Start on Monday
        const monday = new Date(date.setDate(diff));
        const week = [];
        for (let i = 0; i < (viewMode === 'Work Week' ? 5 : 7); i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            week.push(d);
        }
        return week;
    };

    const weekDates = useMemo(() => getWeekDates(new Date(currentDate)), [currentDate, viewMode]);

    // Get month calendar grid
    const getMonthDays = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

        const days = [];

        // Previous month days
        const prevMonthEnd = new Date(year, month, 0).getDate();
        for (let i = startDay - 1; i >= 0; i--) {
            days.push({ date: prevMonthEnd - i, isPrevMonth: true });
        }

        // Current month days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push({ date: i, isCurrentMonth: true });
        }

        // Next month days
        const remaining = 42 - days.length;
        for (let i = 1; i <= remaining; i++) {
            days.push({ date: i, isNextMonth: true });
        }

        return days;
    };

    const monthDays = useMemo(() => getMonthDays(currentDate), [currentDate]);

    // Sample events (in real app, would come from posts or localStorage)
    const [events, setEvents] = useState([
        { id: 1, title: 'Reddit AMA', time: '09:00', duration: 1, color: '#0078d4', date: new Date().toDateString() },
        { id: 2, title: 'Browse r/all', time: '12:00', duration: 2, color: '#0078d4', date: new Date().toDateString() },
        { id: 3, title: 'Weekly Memes Review', time: '14:00', duration: 1.5, color: '#0078d4', date: new Date(Date.now() + 86400000).toDateString() },
    ]);

    const hours = Array.from({ length: 16 }, (_, i) => i + 8); // 8 AM to 11 PM

    const formatMonthYear = (date) => {
        return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    const formatWeekRange = () => {
        if (weekDates.length === 0) return '';
        const start = weekDates[0];
        const end = weekDates[weekDates.length - 1];
        return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
    };

    const goToPrevious = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const goToNext = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const goToToday = () => {
        setCurrentDate(new Date());
        setSelectedDate(new Date());
    };

    const isToday = (date) => {
        const t = new Date();
        return date.getDate() === t.getDate() &&
            date.getMonth() === t.getMonth() &&
            date.getFullYear() === t.getFullYear();
    };

    const getEventsForDate = (date) => {
        return events.filter(e => e.date === date.toDateString());
    };

    const getTimePosition = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        return ((hours - 8) * 60 + (minutes || 0)) / 60;
    };

    const dayNames = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
    const fullDayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // --- Schedule View Logic ---
    const scheduleResources = [
        { id: 'leigh', name: `Calendar - ${settings?.email ? settings.email.split('@')[0] : 'Alex.Johnson'}`, color: '#0078d4' },
        { id: 'nicholas', name: 'James Wilson', color: '#ea9999' }, // Pink
        { id: 'aj', name: 'Maria Garcia', color: '#f6b26b' }, // Orange
        { id: 'alison', name: 'Robert Chen', color: '#6d9eeb' }, // Blue
        { id: 'andrewp', name: 'Emily Davis', color: '#e06666' }, // Red
        { id: 'andrewt', name: 'Michael Brown', color: '#76a5af' }, // Cyan
        { id: 'cynthia', name: 'Sarah Miller', color: '#d5a6bd' }, // Muted pink
        { id: 'debbie', name: 'David Taylor', color: '#b6d7a8' }, // Greenish
        { id: 'elaine', name: 'Jennifer White', color: '#e69138' }, // Darker orange
        { id: 'ethan', name: 'Thomas Anderson', color: '#9fc5e8' }, // Light blue
    ];

    const scheduleEvents = [
        { resourceId: 'leigh', title: 'Reception IT', start: '12:30', end: '13:30', color: '#0078d4', hash: false },
        { resourceId: 'leigh', title: 'Reception IT', start: '12:30', end: '13:30', color: '#0078d4', hash: false, dayOffset: 1 }, // Next day
        { resourceId: 'nicholas', title: 'Annual Leave', start: '11:00', end: '17:00', color: '#e91e63', hash: false }, // Pink
        { resourceId: 'nicholas', title: 'End of Life Steering Group; Microsoft Teams', start: '14:00', end: '15:30', color: '#b6d7a8', hash: true, hatchColor: '#000' },
        { resourceId: 'nicholas', title: '10 point plan group', start: '15:00', end: '16:00', color: '#b6d7a8', hash: true },
        { resourceId: 'aj', title: 'NAMDET North-West', start: '11:00', end: '12:30', color: '#e69138', hash: false },
        { resourceId: 'aj', title: 'Close Down 2025 Service', start: '12:30', end: '15:30', color: '#f6b26b', hash: false },
        { resourceId: 'aj', title: 'Lunch', start: '11:00', end: '12:00', color: '#f6b26b', hash: true },
        { resourceId: 'alison', title: '', start: '11:00', end: '12:00', color: '#3f51b5', hash: false },
        { resourceId: 'andrewp', title: 'AL', start: '11:30', end: '17:00', color: '#e06666', hash: false },
        { resourceId: 'andrewt', title: 'Liverpool University watching surgical sim pilot', start: '11:00', end: '15:00', color: '#00bcd4', hash: false },
        { resourceId: 'andrewt', title: '5th yr surgical bedside teaching on ward', start: '14:00', end: '15:00', color: '#00bcd4', hash: false, isGap: true },
        { resourceId: 'andrewt', title: '5th yr Surgical Bedside teaching with t', start: '14:00', end: '15:00', color: '#00bcd4', hash: false, isGap: true, gapOffset: 20 },
    ];

    // Helper to get pixel position for horizontal timeline
    // 12:00 is starting point content-wise, but grid might start earlier
    // Let's assume grid starts at 08:00
    const getHorizontalPosition = (time) => {
        const [hours, minutes] = time.split(':').map(Number);
        // Base is 08:00
        const totalMinutes = (hours - 8) * 60 + minutes;
        // 1 hour = 200px (wider for schedule view)
        return (totalMinutes / 60) * 200;
    };

    const getDurationWidth = (start, end) => {
        const [h1, m1] = start.split(':').map(Number);
        const [h2, m2] = end.split(':').map(Number);
        const diffMinutes = ((h2 * 60) + m2) - ((h1 * 60) + m1);
        return (diffMinutes / 60) * 200;
    };

    const renderScheduleView = () => (
        <div className="schedule-view-container">
            {/* Resources Sidebar */}
            <div className="schedule-resources">
                {/* Header Gutter */}
                <div className="resource-header-gutter">
                    <div className="date-header-row">
                        <div className="date-cell">19 December 2025</div>
                    </div>
                </div>
                {scheduleResources.map(res => (
                    <div key={res.id} className="resource-row-header" style={{ borderLeftColor: res.color }}>
                        <div className="resource-icon">
                            {/* User/Group Icon */}
                            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zm2-3a2 2 0 11-4 0 2 2 0 014 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 1 4zm-1 0H3c.7-2.5 3.5-3 5-3 1.4 0 4.3.4 5 3z" />
                            </svg>
                        </div>
                        <span className="resource-name">{res.name}</span>
                    </div>
                ))}
            </div>

            {/* Timeline Grid */}
            <div className="schedule-grid-scroll">
                {/* Time Header */}
                <div className="schedule-time-header">
                    {/* Day bands */}
                    <div className="schedule-day-band">
                        <div className="day-label" style={{ width: '2000px' }}>19 December 2025</div>
                        <div className="day-label" style={{ width: '2000px', borderLeft: '1px solid #ccc' }}>20 December 2025</div>
                    </div>
                    {/* Hour bands */}
                    <div className="schedule-hour-band">
                        {Array.from({ length: 32 }, (_, i) => i + 8).map((h, i) => { // 2 days of hours
                            const hour = h % 24;
                            return (
                                <div key={i} className="hour-label" style={{ left: i * 200 }}>
                                    {hour.toString().padStart(2, '0')}:00
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="schedule-grid-content">
                    {/* Vertical Time Marker (e.g. at 14:00) */}
                    <div className="schedule-current-time" style={{ left: getHorizontalPosition('14:00') }}>
                        <div className="time-dot-top"></div>
                    </div>

                    {scheduleResources.map((res, index) => (
                        <div key={res.id} className="schedule-resource-lane">
                            {/* Grid Lines */}
                            {Array.from({ length: 32 }, (_, i) => (
                                <div key={i} className="grid-cell" style={{ left: i * 200 }}></div>
                            ))}

                            {/* Events */}
                            {scheduleEvents.filter(e => e.resourceId === res.id).map((evt, evtIdx) => {
                                const left = getHorizontalPosition(evt.start) + (evt.dayOffset ? evt.dayOffset * 24 * 200 : 0); // hypothetical day offset logic
                                return (
                                    <div
                                        key={evtIdx}
                                        className={`schedule-event ${evt.hash ? 'hatched' : ''}`}
                                        style={{
                                            left: `${left}px`,
                                            width: `${getDurationWidth(evt.start, evt.end)}px`,
                                            backgroundColor: evt.color,
                                            top: evt.isGap ? '20px' : '2px', // Stacking logic
                                            height: evt.isGap ? '18px' : '28px',
                                            marginLeft: evt.gapOffset ? `${evt.gapOffset}px` : '0'
                                        }}
                                        title={evt.title}
                                    >
                                        <span className="schedule-event-title">{evt.title}</span>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="calendar-view">
            {/* Left Mini Calendar - Always visible */}
            <div className="calendar-sidebar">
                {/* Mini calendar navigation */}
                <div className="mini-calendar">
                    <div className="mini-calendar-header">
                        <button className="mini-nav-btn" onClick={() => {
                            const d = new Date(currentDate);
                            d.setMonth(d.getMonth() - 1);
                            setCurrentDate(d);
                        }}>‹</button>
                        <span className="mini-calendar-title">{formatMonthYear(currentDate)}</span>
                        <button className="mini-nav-btn" onClick={() => {
                            const d = new Date(currentDate);
                            d.setMonth(d.getMonth() + 1);
                            setCurrentDate(d);
                        }}>›</button>
                    </div>
                    <div className="mini-calendar-grid">
                        <div className="mini-calendar-row mini-calendar-days">
                            {dayNames.map(d => <span key={d} className="mini-day-header">{d}</span>)}
                        </div>
                        <div className="mini-calendar-dates">
                            {monthDays.map((day, i) => (
                                <span
                                    key={i}
                                    className={`mini-date ${day.isCurrentMonth ? '' : 'other-month'} 
                    ${day.isCurrentMonth && day.date === today.getDate() && currentDate.getMonth() === today.getMonth() ? 'today' : ''}
                    ${day.isCurrentMonth && day.date === selectedDate.getDate() && currentDate.getMonth() === selectedDate.getMonth() ? 'selected' : ''}`}
                                    onClick={() => {
                                        if (day.isCurrentMonth) {
                                            const newDate = new Date(currentDate);
                                            newDate.setDate(day.date);
                                            setSelectedDate(newDate);
                                            setCurrentDate(newDate);
                                        }
                                    }}
                                >
                                    {day.date}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* My Calendars section */}
                <div className="calendar-list">
                    <div className="calendar-list-section">
                        <div className="calendar-list-header">
                            <span className="expand-icon">›</span>
                            <span>United Kingdom holidays</span>
                        </div>
                    </div>
                    <div className="calendar-list-section expanded">
                        <div className="calendar-list-header">
                            <span className="expand-icon expanded">›</span>
                            <span>My Calendars</span>
                        </div>
                        <div className="calendar-list-items">
                            <label className="calendar-item selected">
                                <input type="checkbox" defaultChecked />
                                <span className="calendar-color" style={{ background: '#0078d4' }}></span>
                                <span>Calendar - {settings?.email || 'alex.johnson@contoso.com'}</span>
                            </label>
                            <label className="calendar-item">
                                <input type="checkbox" />
                                <span className="calendar-color" style={{ background: '#dcb67a' }}></span>
                                <span>Birthdays</span>
                            </label>
                            <label className="calendar-item">
                                <input type="checkbox" />
                                <span className="calendar-color" style={{ background: '#5c6bc0' }}></span>
                                <span>Reddit Posts</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Calendar Area */}
            <div className="calendar-main">
                {/* Header with navigation */}
                <div className="calendar-header">
                    <div className="calendar-nav">
                        <button className="calendar-today-btn" onClick={goToToday}>Today</button>
                        <button className="calendar-nav-btn" onClick={goToPrevious}>‹</button>
                        <button className="calendar-nav-btn" onClick={goToNext}>›</button>
                        <span className="calendar-range">{formatWeekRange()}</span>
                    </div>
                    <div className="calendar-view-options">
                        <select
                            className="view-mode-select"
                            value={viewMode}
                            onChange={(e) => setViewMode(e.target.value)}
                        >
                            <option>Day</option>
                            <option>Work Week</option>
                            <option>Week</option>
                            <option>Month</option>
                            <option>Schedule View</option>
                        </select>
                    </div>
                </div>

                {viewMode === 'Schedule View' ? renderScheduleView() : (
                    <>
                        {/* Day Headers */}
                        <div className="calendar-day-headers">
                            <div className="time-gutter-header"></div>
                            {weekDates.map((date, i) => (
                                <div
                                    key={i}
                                    className={`day-header ${isToday(date) ? 'today' : ''}`}
                                >
                                    <div className="day-name">{fullDayNames[i] || date.toLocaleDateString('en-US', { weekday: 'long' })}</div>
                                    <div className="day-date-number">
                                        <span className={`date-badge ${isToday(date) ? 'today' : ''}`}>{date.getDate()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Time Grid */}
                        <div className="calendar-grid-container">
                            <div className="calendar-time-grid">
                                {/* Time gutter */}
                                <div className="time-gutter">
                                    {hours.map(hour => (
                                        <div key={hour} className="time-slot-label">
                                            {hour.toString().padStart(2, '0')}:00
                                        </div>
                                    ))}
                                </div>

                                {/* Day columns */}
                                {weekDates.map((date, dayIndex) => (
                                    <div key={dayIndex} className={`day-column ${isToday(date) ? 'today' : ''}`}>
                                        {hours.map(hour => (
                                            <div key={hour} className="time-slot">
                                                {/* Render events */}
                                            </div>
                                        ))}

                                        {/* Render events for this day */}
                                        {getEventsForDate(date).map(event => (
                                            <div
                                                key={event.id}
                                                className="calendar-event"
                                                style={{
                                                    top: `${getTimePosition(event.time) * 48}px`,
                                                    height: `${event.duration * 48}px`,
                                                    backgroundColor: event.color,
                                                }}
                                            >
                                                <div className="event-title">{event.title}</div>
                                                <div className="event-time">{event.time}</div>
                                            </div>
                                        ))}

                                        {/* Current time line */}
                                        {isToday(date) && (
                                            <div
                                                className="current-time-line"
                                                style={{
                                                    top: `${((new Date().getHours() - 8) * 60 + new Date().getMinutes()) / 60 * 48}px`
                                                }}
                                            >
                                                <div className="time-dot"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default CalendarView;
