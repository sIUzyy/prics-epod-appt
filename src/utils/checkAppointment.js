// functio to check exisint appointment
export const hasExistingAppointment = (data, plateNo, date) => {
  return data.some((appointment) => {
    const appointmentDate = new Date(
      appointment.appointment_date
    ).toDateString();
    const selectedDateStr = new Date(date).toDateString();
    return (
      appointment.plate_no === plateNo && appointmentDate === selectedDateStr
    );
  });
};
