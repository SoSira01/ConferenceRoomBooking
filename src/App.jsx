import React, { useState } from 'react';
import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import SnowfallEffect from './components/Snowflake';
import background from './assets/Christmas.jpg'; 

const App = () => {
  const [refresh, setRefresh] = useState(false);

  const handleBookingSuccess = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div 
      data-theme="cupcake"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',        
        backgroundRepeat: 'no-repeat',  
        backgroundAttachment: 'fixed'   
      }}
    >
      <SnowfallEffect count={75} /> 

      <div className="min-h-screen p-4 flex flex-col md:flex-row bg-opacity-80">
        <div className="md:flex-1 p-2">
          <BookingForm onBookingSuccess={handleBookingSuccess} />
        </div>
        <div className="md:flex-1 p-2">
          <BookingList refresh={refresh} />
        </div>
      </div>
    </div>
  );
};

export default App;
