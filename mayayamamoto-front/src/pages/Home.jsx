import { useState } from 'react';
import Header from '../components/Header';
import Patients from '../components/Patients';

export default function Home() {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="home">
        {activeTab === 'patients' && <Patients />}
        {/* you can add other sections for different tabs */}
      </div>
    </>
  );
}