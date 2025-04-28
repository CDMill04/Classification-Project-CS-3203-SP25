// components/Notification.tsx
import React, { useEffect } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  useEffect(() => {
    // Set the auto-close timer when the notification is shown
    const timer = setTimeout(() => {
      onClose(); // Automatically close the notification after 3 seconds
    }, 3000); // Adjust the time

    // Cleanup the timer if the component is unmounted or the notification is closed manually
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="notification">
      {message}
      <button className="close-btn" onClick={onClose}>x</button>
    </div>
  );
};

export default Notification;
