import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import './App.css';

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleBookingSuccess = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="min-h-screen p-4 flex flex-col md:flex-row" data-theme="cupcake">
      <div className="md:flex-1 p-2">
        <BookingForm onBookingSuccess={handleBookingSuccess} />
      </div>
      <div className="md:flex-1 p-2">
        <BookingList refresh={refresh} />
      </div>
    </div>
  );
};

export default App;
