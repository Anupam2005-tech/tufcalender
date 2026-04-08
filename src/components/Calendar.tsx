"use client";

import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  addWeeks, 
  subWeeks, 
  addDays, 
  subDays, 
  addYears, 
  subYears,
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameDay, 
  isWithinInterval, 
  isAfter, 
  isBefore,
  isToday,
  parseISO,
  startOfYear,
  endOfYear,
  eachMonthOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, StickyNote, Calendar as CalendarIcon, FastForward, Search } from 'lucide-react';

interface Range {
  start: Date | null;
  end: Date | null;
}

interface Notes {
  [dateKey: string]: string;
}

type ViewMode = 'day' | 'week' | 'month' | 'year';

const MONTHLY_IMAGES: { [key: string]: string } = {
  'January': 'https://images.unsplash.com/photo-1477601263568-187f0a74ad92?auto=format&fit=crop&w=1200&q=80',
  'February': 'https://images.unsplash.com/photo-1516627145497-ae65658f26d7?auto=format&fit=crop&w=1200&q=80',
  'March': 'https://images.unsplash.com/photo-1490750967868-85698f719333?auto=format&fit=crop&w=1200&q=80',
  'April': 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
  'May': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80',
  'June': 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  'July': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'August': 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
  'September': 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80',
  'October': 'https://images.unsplash.com/photo-1476820865390-ed3be7759675?auto=format&fit=crop&w=1200&q=80',
  'November': 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1200&q=80',
  'December': 'https://images.unsplash.com/photo-1483921321769-677a4bd77574?auto=format&fit=crop&w=1200&q=80',
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<ViewMode>('month');
  const [range, setRange] = useState<Range>({ start: null, end: null });
  const [notes, setNotes] = useState<Notes>({});
  const [activeNoteDate, setActiveNoteDate] = useState<string | null>(null);
  const [dateInputValue, setDateInputValue] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('calendar-notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-notes', JSON.stringify(notes));
  }, [notes]);

  const handlePrev = () => {
    if (view === 'day') setCurrentDate(subDays(currentDate, 1));
    else if (view === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else if (view === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (view === 'year') setCurrentDate(subYears(currentDate, 1));
  };

  const handleNext = () => {
    if (view === 'day') setCurrentDate(addDays(currentDate, 1));
    else if (view === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else if (view === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (view === 'year') setCurrentDate(addYears(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date());

  const goToDate = (e: React.FormEvent) => {
    e.preventDefault();
    const date = parseISO(dateInputValue);
    if (!isNaN(date.getTime())) {
      setCurrentDate(date);
    }
  };

  const clearRange = () => setRange({ start: null, end: null });

  const handleDateClick = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    setActiveNoteDate(dateKey);
    if (!range.start || (range.start && range.end)) {
      setRange({ start: date, end: null });
    } else if (range.start && !range.end) {
      if (isBefore(date, range.start)) {
        setRange({ start: date, end: range.start });
      } else {
        setRange({ start: range.start, end: date });
      }
    }
  };

  const updateNote = (dateKey: string, text: string) => {
    setNotes(prev => ({ ...prev, [dateKey]: text }));
  };

  const DayCell = ({ day, isCurrentMonth = true, isYearView = false }: { day: Date, isCurrentMonth?: boolean, isYearView?: boolean }) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    const isSelectedStart = range.start && isSameDay(day, range.start);
    const isSelectedEnd = range.end && isSameDay(day, range.end);
    const isWithinRange = range.start && range.end && isWithinInterval(day, { start: range.start, end: range.end });
    const today = isToday(day);
    const hasNote = !!notes[dateKey];

    return (
      <div 
        onClick={() => handleDateClick(day)}
        className={`
          relative cursor-pointer transition-all duration-200 flex items-center justify-center
          ${isYearView ? 'aspect-square p-0' : 'h-24 md:h-32 p-2'}
          ${isCurrentMonth ? 'bg-white' : 'bg-slate-50/50 text-slate-400'}
          ${isWithinRange ? 'bg-indigo-50/50' : ''}
          ${hasNote && !isWithinRange ? 'bg-amber-50/30' : ''}
          hover:bg-slate-100/80 z-0
        `}
      >
        <span className={`
          font-medium flex items-center justify-center rounded-full transition-colors
          ${isSelectedStart || isSelectedEnd ? 'bg-blue-600 text-white' : ''}
          ${today && !isSelectedStart && !isSelectedEnd ? 'bg-stone-800 text-white' : ''}
          ${(!isSelectedStart && !isSelectedEnd && !today) ? 'text-stone-900' : ''}
          ${today && (isSelectedStart || isSelectedEnd) ? 'ring-2 ring-offset-1 ring-stone-800' : ''}
          ${hasNote ? 'ring-1 ring-amber-400' : ''}
          ${isYearView ? 'text-[10px] w-5 h-5' : 'text-sm w-7 h-7'}
        `}>
          {format(day, 'd')}
        </span>
        {hasNote && (
          <div 
            onClick={(e) => {
              e.stopPropagation();
              setActiveNoteDate(dateKey);
            }}
            className={`absolute ${isYearView ? 'bottom-0 right-0 w-1 h-1' : 'bottom-2 right-2 w-2 h-2'} bg-amber-400 rounded-full border border-white shadow-sm z-10`}
          />
        )}
      </div>
    );
  };

  const renderView = () => {
    if (view === 'day') {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-12 bg-white rounded-3xl border border-slate-200 shadow-inner">
          <h3 className="text-4xl font-serif font-bold text-slate-800 mb-6">{format(currentDate, 'EEEE, MMMM do, yyyy')}</h3>
          <DayCell day={currentDate} />
        </div>
      );
    }

    if (view === 'week') {
      const start = startOfWeek(currentDate);
      const end = endOfWeek(start);
      const days = eachDayOfInterval({ start, end });
      return (
        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-slate-50 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">{day}</div>
          ))}
          {days.map(day => <DayCell key={format(day, 'yyyy-MM-dd')} day={day} />)}
        </div>
      );
    }

    if (view === 'month') {
      const monthStart = startOfMonth(currentDate);
      const monthEnd = endOfMonth(monthStart);
      const startDate = startOfWeek(monthStart);
      const endDate = endOfWeek(monthEnd);
      const days = eachDayOfInterval({ start: startDate, end: endDate });
      return (
        <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-slate-50 py-3 text-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">{day}</div>
          ))}
          {days.map(day => (
            <DayCell key={format(day, 'yyyy-MM-dd')} day={day} isCurrentMonth={isSameDay(startOfMonth(day), monthStart)} />
          ))}
        </div>
      );
    }

    if (view === 'year') {
      const start = startOfYear(currentDate);
      const end = endOfYear(start);
      const months = eachMonthOfInterval({ start, end });
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-inner">
          {months.map(monthDate => {
            const mStart = startOfMonth(monthDate);
            const mEnd = endOfMonth(mStart);
            const days = eachDayOfInterval({ start: mStart, end: mEnd });
            return (
              <div key={format(monthDate, 'yyyy-MM')} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-center font-bold text-xs mb-3 text-slate-600 uppercase tracking-wider">{format(monthDate, 'MMMM')}</div>
                <div className="grid grid-cols-7 gap-1">
                  {days.map(day => <DayCell key={format(day, 'yyyy-MM-dd')} day={day} isYearView />)}
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const monthName = format(currentDate, 'MMMM');
  const heroImage = MONTHLY_IMAGES[monthName] || MONTHLY_IMAGES['January'];

  return (
    <div className="flex flex-col lg:flex-row gap-10 max-w-7xl w-full bg-white p-6 md:p-12 rounded-[40px] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] border border-slate-100">
      <div className="flex-1 flex flex-col gap-8">
        <div className="relative h-72 md:h-96 w-full rounded-[32px] overflow-hidden shadow-2xl group">
          <img src={heroImage} alt={monthName} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight drop-shadow-lg">{monthName}</h1>
            <p className="text-xl opacity-80 font-medium tracking-wide">{format(currentDate, 'yyyy')}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 px-2">
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 shadow-sm">
              {(['day', 'week', 'month', 'year'] as ViewMode[]).map(m => (
                <button 
                  key={m} 
                  onClick={() => setView(m)}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${view === m ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </button>
              ))}
            </div>
            <button onClick={goToToday} className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all active:scale-95 shadow-sm">
              <FastForward size={14} /> Today
            </button>
          </div>

          <form onSubmit={goToDate} className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="date" 
                value={dateInputValue} 
                onChange={(e) => setDateInputValue(e.target.value)}
                className="pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-700 bg-slate-50 hover:bg-white transition-all"
              />
            </div>
            <button type="submit" className="px-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all active:scale-95 text-slate-700 shadow-sm">Go</button>
          </form>

          <div className="flex items-center gap-3">
            {range.start && (
              <button onClick={clearRange} className="px-3 py-2 text-xs font-semibold text-slate-400 hover:text-red-500 transition-colors">Clear Range</button>
            )}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-sm">
              <button 
                onClick={handlePrev} 
                className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 flex items-center justify-center"
                title="Previous"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNext} 
                className="p-2 hover:bg-white rounded-lg transition-all text-slate-600 hover:text-indigo-600 flex items-center justify-center"
                title="Next"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-slate-500 mb-2 px-2">
          <CalendarIcon size={22} className="text-indigo-500" />
          <span className="font-bold uppercase tracking-widest text-xs">{format(currentDate, view === 'year' ? 'yyyy' : 'MMMM yyyy')}</span>
        </div>

        {renderView()}
      </div>

      <div className="w-full lg:w-96 flex flex-col gap-6 bg-slate-50/50 p-8 rounded-[32px] border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 text-slate-800 border-b border-slate-200 pb-6">
          <div className="p-2 bg-amber-100 rounded-lg">
            <StickyNote size={20} className="text-amber-600" />
          </div>
          <h2 className="font-bold text-xl tracking-tight">Journal</h2>
        </div>

        {activeNoteDate ? (
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Note for</p>
                <p className="text-sm font-semibold text-slate-800">{activeNoteDate}</p>
              </div>
              <button onClick={() => setActiveNoteDate(null)} className="text-xs font-medium text-slate-400 hover:text-slate-600 underline decoration-slate-300 transition-colors">Close</button>
            </div>
            <textarea 
              className="w-full h-48 p-4 rounded-2xl border border-slate-200 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none resize-none text-sm bg-white text-slate-800 shadow-sm transition-all"
              value={notes[activeNoteDate] || ''}
              onChange={(e) => updateNote(activeNoteDate, e.target.value)}
              placeholder="Write your thoughts for this day..."
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <div className="p-4 bg-slate-100 rounded-full mb-4">
              <StickyNote size={32} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-400 font-medium leading-relaxed">
              Select a date from the calendar <br /> to view or add a personal note.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
