import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../firebaseConfig';
import BookingCalendar from './BookingCalendar';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const bookingsRef = ref(database, 'bookings/');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.values(data);
        setBookings(bookingsArray);
        setFilteredBookings(bookingsArray);
      }
    });
  }, []);

  const handleDateChange = (date) => {
    const selectedDate = date.toISOString().split('T')[0]; // YYYY-MM-DD
    setFilterDate(selectedDate);

    if (selectedDate) {
      const filtered = bookings.filter(booking => booking.date === selectedDate);
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8" data-theme="cupcake">
      <h2 className="text-2xl font-bold text-center">Current Bookings</h2>
      <BookingCalendar bookings={bookings} onDateChange={handleDateChange} />
      
      <div className="grid grid-cols-1 gap-4 mt-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <div key={index} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="font-bold">Room ID: {booking.roomId || '1'}</h3> {/* Assuming only one room */}
                <p>Date: {booking.date}</p>
                <p>Time Slot: {booking.timeSlot}</p>
                <p>Booked By: {booking.bookedBy}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No bookings found for this date.</p>
        )}
      </div>
    </div>
  );
};

export default BookingList;
