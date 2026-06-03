import { useEffect } from 'react';
import './WelcomeScreen.css';

export default function WelcomeScreen({ onFinish }) {
  useEffect(() => {
    const timer = setTimeout(onFinish, 3_000); // 10 seconds
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="welcome-screen">
      <h1>Welcome to Music World</h1>
    </div>
  );
}