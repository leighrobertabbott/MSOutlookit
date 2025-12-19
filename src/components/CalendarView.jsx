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

    return (
        <div className="calendar-view">
            {/* Left Mini Calendar */}
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
                    <div className="calendar-list-section">
                        <div className="calendar-list-header">
                            <span className="expand-icon">›</span>
                            <span>Shared Calendars</span>
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
                        </select>
                    </div>
                </div>

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
            </div>
        </div>
    );
}

export default CalendarView;
