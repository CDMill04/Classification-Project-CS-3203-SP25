import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true); // Show notification when message changes

    // Set the auto-close timer when the notification is shown
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the notification after 3 seconds
      onClose(); // Call onClose after 3 seconds
    }, 3000);

    // Cleanup the timer if the notification is unmounted or closed manually
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div
      className={`notification ${isVisible ? 'visible' : 'hidden'}`} // Toggle visibility
    >
      <button className="close-btn" onClick={() => { setIsVisible(false); onClose(); }}>x</button> {/* Close button on the left */}
      {message}
    </div>
  );
};

export default Notification;
