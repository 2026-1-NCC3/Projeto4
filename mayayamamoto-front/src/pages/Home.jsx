import { useState } from 'react';
import Header from '../components/Header';
import Patients from '../components/Patients';
import Exercise from '../components/exercise';

export default function Home() {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="home">
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'exercise' && <Exercise />}
        {/* you can add other sections for different tabs */}
      </div>
    </>
  );
}