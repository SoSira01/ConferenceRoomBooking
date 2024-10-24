// src/components/BookingForm.jsx
import React, { useState, useEffect } from 'react';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import app from '../firebaseConfig';

const db = getDatabase(app);

const BookingForm = ({ onBookingSuccess }) => {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [bookedBy, setBookedBy] = useState('');
  const [bookings, setBookings] = useState([]); 

  const generateTimeOptions = () => {
    const timeOptions = [];
    for (let hour = 8; hour <= 19; hour++) {
      const hourString = hour.toString().padStart(2, '0');
      timeOptions.push(`${hourString}:00`);
      timeOptions.push(`${hourString}:30`);
    }
    return timeOptions;
  };

  useEffect(() => {
    const bookingsRef = ref(db, 'bookings/');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.values(data);
        setBookings(bookingsArray);
      }
    });
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (date && bookedBy && startTime && endTime) {
      if (startTime >= endTime) {
        alert('End time must be after start time.');
        return;
      }

      let isOverlapping = false;

      for (let i = 0; i < bookings.length; i++) {
        const booking = bookings[i];
        
        if (booking.date === date) {
          const [bookingStart, bookingEnd] = booking.timeSlot.split('-');

          if (
            (startTime >= bookingStart && startTime < bookingEnd) || 
            (endTime > bookingStart && endTime <= bookingEnd) ||
            (bookingStart >= startTime && bookingStart < endTime) || 
            (bookingEnd > startTime && bookingEnd <= endTime)
          ) {
            isOverlapping = true;
            break;
          }
        }
      }

      if (isOverlapping) {
        alert('The selected time slot overlaps with an existing booking.');
        return;
      }

      const newBookingRef = ref(db, 'bookings/' + new Date().getTime());
      await set(newBookingRef, {
        date,
        timeSlot: `${startTime}-${endTime}`,
        bookedBy,
      });
      alert('Booking successful!');
      setDate('');
      setStartTime('');
      setEndTime('');
      setBookedBy('');
      onBookingSuccess(); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Book Meeting Room</h2>
      <input 
        type="date" 
        value={date} 
        onChange={(e) => setDate(e.target.value)} 
        required 
        className="input input-bordered w-full mb-2" 
      />
      
      <div className="flex mb-2">
        <select
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
          className="input input-bordered w-full mr-2"
        >
          <option value="">Select Start Time</option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
        
        <select
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
          className="input input-bordered w-full"
        >
          <option value="">Select End Time</option>
          {generateTimeOptions().map((time) => (
            <option key={time} value={time}>{time}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Booked By"
        value={bookedBy}
        onChange={(e) => setBookedBy(e.target.value)}
        required
        className="input input-bordered w-full mb-4"
      />
      
      <button type="submit" className="btn btn-primary w-full">Book Room</button>
    </form>
  );
};

export default BookingForm;
