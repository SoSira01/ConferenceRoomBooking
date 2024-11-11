import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import './App.css';

const App = () => {
  const [refresh, setRefresh] = useState(false);
  const [bookings, setBookings] = useState([]);

  const handleBookingSuccess = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4" data-theme="cupcake">
      <h1 className="text-4xl font-bold text-center">Meeting Room Booking System</h1>
      <BookingForm bookings={bookings} onBookingSuccess={handleBookingSuccess} />
      <BookingList setBookings={setBookings} refresh={refresh} />
    </div>
  );
};

export default App;
