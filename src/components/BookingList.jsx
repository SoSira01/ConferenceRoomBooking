// src/components/BookingList.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import app from '../firebaseConfig'; 

const db = getDatabase(app);

const BookingList = ({ refresh }) => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const bookingsRef = ref(db, 'bookings/');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.entries(data).map(([id, booking]) => ({
          id,
          ...booking,
        }));
        setBookings(bookingsArray);
        setFilteredBookings(bookingsArray);
      } else {
        setBookings([]); // Reset bookings if no data is found
        setFilteredBookings([]);
      }
    });
  }, [refresh]);

  useEffect(() => {
    // Set today's date as the default filter date
    const today = new Date().toISOString().split('T')[0];
    setFilterDate(today);
  }, []);

  const handleFilterChange = (e) => {
    const selectedDate = e.target.value;
    setFilterDate(selectedDate);

    if (selectedDate) {
      const filtered = bookings.filter(booking => booking.date === selectedDate);
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  };

  const handleDelete = async (id) => {
    const bookingRef = ref(db, `bookings/${id}`);
    await remove(bookingRef);
    alert('Booking deleted successfully!');
    
    // Update the local state after deletion
    const updatedBookings = bookings.filter(booking => booking.id !== id);
    setBookings(updatedBookings);
    setFilteredBookings(updatedBookings.filter(booking => booking.date === filterDate));
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
      <input
        type="date"
        value={filterDate}
        onChange={handleFilterChange}
        className="input input-bordered w-full mb-4"
      />
      <div className="grid grid-cols-1 gap-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking) => (
            <div key={booking.id} className="card bg-base-100 shadow-md">
              <div className="card-body">
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
                <p><strong>Booked By:</strong> {booking.bookedBy}</p>
                <button 
                  onClick={() => handleDelete(booking.id)}
                  className="btn btn-danger mt-2"
                >
                  Delete Booking
                </button>
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
