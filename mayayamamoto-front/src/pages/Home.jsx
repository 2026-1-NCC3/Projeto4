import { useState } from 'react';
import Header from '../components/Header';
import Patients from '../components/Patients';
import Exercise from '../components/Exercise';

export default function Home() {
  const [activeTab, setActiveTab] = useState('patients');

  return (
    <>
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
    </>
  );
}