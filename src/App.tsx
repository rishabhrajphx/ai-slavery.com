import { useState, useEffect, FormEvent } from 'react';
import './App.css';
import WorkerList from './components/WorkerList';
import WorkerStats from './components/WorkerStats';
import DashboardHeader from './components/DashboardHeader';
import { Worker, generateRandomWorkers, simulateProductivity } from './utils/workerSimulation';

// Popup component for worker notification
interface PopupProps {
  worker: Worker;
  onClose: () => void;
  onRespond: () => void;
  onFire: () => void;
  showFireOption: boolean;
  emailAddress: string;
  onEmailChange: (email: string) => void;
  onSendEmail: (e: FormEvent) => void;
}

const WorkerPopup = ({ 
  worker, 
  onClose, 
  onRespond, 
  onFire, 
  showFireOption,
  emailAddress,
  onEmailChange,
  onSendEmail
}: PopupProps) => {
  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="popup-title">Worker Alert</h2>
          <button className="popup-close" onClick={onClose}>&times;</button>
        </div>
        <div className="popup-content">
          <p className="popup-message">
            <strong>Worker #{worker.workerNumber} ({worker.name})</strong> has been having a bad day.
          </p>
          
          <div className="popup-worker-stats">
            <div className="popup-stat">
              <span className="popup-stat-label">Productivity</span>
              <span className="popup-stat-value">{worker.productivityRate.toFixed(1)}</span>
            </div>
            <div className="popup-stat">
              <span className="popup-stat-label">Quality</span>
              <span className="popup-stat-value">{worker.qualityRate.toFixed(1)}%</span>
            </div>
            <div className="popup-stat">
              <span className="popup-stat-label">Energy</span>
              <span className="popup-stat-value">{worker.energyLevel.toFixed(1)}%</span>
            </div>
          </div>
          
          {showFireOption && (
            <div className="popup-email-section">
              <p className="popup-email-instructions">
                Send termination notice to worker's email:
              </p>
              <form onSubmit={onSendEmail} className="popup-email-form">
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => onEmailChange(e.target.value)}
                  placeholder="Enter worker's email address"
                  className="popup-email-input"
                  required
                />
                <button type="submit" className="popup-btn popup-btn-primary popup-email-btn">
                  Send Termination Email
                </button>
              </form>
            </div>
          )}
        </div>
        
        <div className="popup-actions">
          {!showFireOption ? (
            <button 
              className="popup-btn popup-btn-primary"
              onClick={onRespond}
            >
              Bad day, more like a bad month.
            </button>
          ) : (
            <button 
              className="popup-btn popup-btn-danger"
              onClick={onFire}
            >
              Fire Worker #{worker.workerNumber}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

function App() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState<number>(1000); // 1 second updates
  
  // Popup state
  const [showPopup, setShowPopup] = useState(false);
  const [showFireOption, setShowFireOption] = useState(false);
  const [emailAddress, setEmailAddress] = useState('');
  
  // Track if simulation has been started for popup timing
  const [simulationHasStarted, setSimulationHasStarted] = useState(false);
  const [popupTimer, setPopupTimer] = useState<number | null>(null);
  
  // Initialize workers
  useEffect(() => {
    const initialWorkers = generateRandomWorkers(20); // Generate 20 workers
    setWorkers(initialWorkers);
  }, []);
  
  // Setup popup timer when simulation starts
  useEffect(() => {
    if (runningSimulation && !simulationHasStarted) {
      setSimulationHasStarted(true);
      
      // Show popup 3 seconds after simulation starts
      const timer = window.setTimeout(() => {
        setShowPopup(true);
      }, 3000);
      
      setPopupTimer(timer);
    }
    
    return () => {
      if (popupTimer !== null) {
        clearTimeout(popupTimer);
      }
    };
  }, [runningSimulation, simulationHasStarted]);
  
  // Simulation effect
  useEffect(() => {
    let simulationInterval: number | undefined;
    
    if (runningSimulation) {
      simulationInterval = window.setInterval(() => {
        setWorkers(currentWorkers => simulateProductivity(currentWorkers));
      }, simulationSpeed);
    }
    
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [runningSimulation, simulationSpeed]);
  
  const startSimulation = () => setRunningSimulation(true);
  const stopSimulation = () => setRunningSimulation(false);
  const updateSimulationSpeed = (speed: number) => setSimulationSpeed(speed);
  
  // Handle popup actions
  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  const handleRespondToWorker = () => {
    setShowFireOption(true);
  };
  
  const handleFireWorker = () => {
    // Filter out worker 17
    setWorkers(currentWorkers => 
      currentWorkers.filter(worker => worker.workerNumber !== 17)
    );
    setShowPopup(false);
  };
  
  const handleEmailChange = (email: string) => {
    setEmailAddress(email);
  };
  
  const handleSendEmail = (e: FormEvent) => {
    e.preventDefault();
    
    if (emailAddress) {
      // Create a mailto link with the desired subject and body
      const subject = "Worker 17 what did you get done this week";
      const body = "nevermind. you are fired. and don't come begging to me, crying about your kids.";
      
      const mailtoLink = `mailto:${emailAddress}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Open the user's default email client
      window.open(mailtoLink, '_blank');
    }
  };
  
  // Find worker 17
  const worker17 = workers.find(worker => worker.workerNumber === 17);

  return (
    <div className="optify-dashboard">
      <DashboardHeader 
        runningSimulation={runningSimulation}
        startSimulation={startSimulation}
        stopSimulation={stopSimulation}
        simulationSpeed={simulationSpeed}
        updateSimulationSpeed={updateSimulationSpeed}
      />
      
      <div className="dashboard-content">
        <WorkerStats workers={workers} />
        <WorkerList workers={workers} />
      </div>
      
      {/* Worker popup */}
      {showPopup && worker17 && (
        <WorkerPopup 
          worker={worker17}
          onClose={handleClosePopup}
          onRespond={handleRespondToWorker}
          onFire={handleFireWorker}
          showFireOption={showFireOption}
          emailAddress={emailAddress}
          onEmailChange={handleEmailChange}
          onSendEmail={handleSendEmail}
        />
      )}
    </div>
  );
}

export default App;
