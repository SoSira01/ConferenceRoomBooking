// src/components/BookingList.jsx
import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import app from '../firebaseConfig'; 
import Swal from 'sweetalert2';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; // Import moment
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment); // Use moment here instead of require

const db = getDatabase(app);

const BookingList = ({ refresh }) => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const bookingsRef = ref(db, 'bookings/');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.entries(data).map(([id, booking]) => ({
          id,
          title: booking.bookedBy, // Event title
          start: moment(booking.date + 'T' + booking.timeSlot).toDate(), // Combine date and time for start
          end: moment(booking.date + 'T' + booking.timeSlot).toDate(), // Use the same time for end or adjust as needed
          allDay: true, // Set to true if it's an all-day event
        }));
        setBookings(bookingsArray);
        setEvents(bookingsArray);
      } else {
        setBookings([]); // Reset bookings if no data is found
        setEvents([]);
      }
    });
  }, [refresh]);

  const handleDelete = async (id) => {
    const bookingRef = ref(db, `bookings/${id}`);
    
    // Display the confirmation dialog
    const result = await Swal.fire({
      title: 'Delete booking',
      text: 'Are you sure you want to delete this booking?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });
  
    // Only proceed with deletion if the user confirms
    if (result.isConfirmed) {
      await remove(bookingRef);
      Swal.fire('Success', 'Booking deleted successfully!', 'success');
      
      // Update the local state after deletion
      const updatedBookings = bookings.filter(booking => booking.id !== id);
      setBookings(updatedBookings);
      setEvents(updatedBookings.map((booking) => ({
        id: booking.id,
        title: booking.bookedBy,
        start: moment(booking.date + 'T' + booking.timeSlot).toDate(),
        end: moment(booking.date + 'T' + booking.timeSlot).toDate(),
        allDay: true,
      })));
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = '#ffcccc'; // Change color as needed
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '0',
      display: 'block',
    };
    return {
      style,
    };
  };

  return (
    <div className="bg-white p-4 rounded shadow-lg">
      <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
      <div style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={(event) => handleDelete(event.id)} // Deleting by clicking on event
        />
      </div>
      {events.length === 0 && <p className="text-center">No bookings found.</p>}
    </div>
  );
};

export default BookingList;
