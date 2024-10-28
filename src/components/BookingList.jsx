import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import app from '../firebaseConfig'; 
import Swal from 'sweetalert2';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment'; 
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);
const db = getDatabase(app);

const BookingList = ({ refresh }) => {
  const [bookings, setBookings] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const bookingsRef = ref(db, 'bookings/');
    onValue(bookingsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const bookingsArray = Object.entries(data).map(([id, booking]) => {
          const [startSlot, endSlot] = booking.timeSlot.split('-');
          return {
            id,
            title: booking.bookedBy,
            start: moment(booking.date + 'T' + startSlot).toDate(),
            end: moment(booking.date + 'T' + endSlot).toDate(),
            allDay: false,
          };
        });
        setBookings(bookingsArray);
        setEvents(bookingsArray);
      } else {
        setBookings([]);
        setEvents([]);
      }
    });
  }, [refresh]);

  const handleDelete = async (event) => {
    const bookingRef = ref(db, `bookings/${event.id}`);
    const result = await Swal.fire({
      title: 'Delete booking',
      text: `Are you sure you want to delete the booking by "${event.title}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      await remove(bookingRef);
      Swal.fire('Success', 'Booking deleted successfully!', 'success');

      const updatedBookings = bookings.filter(booking => booking.id !== event.id);
      setBookings(updatedBookings);
      setEvents(updatedBookings);
    }
  };

  const eventStyleGetter = (event) => {
    const backgroundColor = '#ffcccc'; 
    const style = {
      backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'black',
      border: '2px solid #FF666678',
      display: 'block',
    };
    return {
      style,
    };
  };
  

  return (
    <div className="bg-white p-4 rounded shadow-lg" data-theme="cupcake">
      <h2 className="text-xl font-bold mb-4">Current Bookings</h2>
      <div style={{ height: '500px' }}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleDelete}
          defaultView="day"
          views={['month', 'week', 'day']}
        />
      </div>
      {events.length === 0 && <p className="text-center">No bookings found.</p>}
    </div>
  );
};

export default BookingList;
