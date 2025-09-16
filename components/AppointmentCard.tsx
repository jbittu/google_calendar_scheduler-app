export default function AppointmentCard({ appointment }: { appointment: any }) {
  return (
    <div className="border p-4 rounded shadow-sm">
      <h3 className="font-medium">{appointment.summary}</h3>
      <p className="text-sm text-gray-500">
        {new Date(appointment.start).toLocaleString()} -{" "}
        {new Date(appointment.end).toLocaleString()}
      </p>
      <p className="text-xs text-gray-400">
        With: {appointment.buyer?.name || appointment.seller?.name}
      </p>
      {appointment.meetLink && (
        <a
          href={appointment.meetLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          Join Meeting
        </a>
      )}
    </div>
  );
}
