interface DashboardHeaderProps {
  runningSimulation: boolean;
  startSimulation: () => void;
  stopSimulation: () => void;
  simulationSpeed: number;
  updateSimulationSpeed: (speed: number) => void;
}

const DashboardHeader = ({
  runningSimulation,
  startSimulation,
  stopSimulation,
  simulationSpeed,
  updateSimulationSpeed
}: DashboardHeaderProps) => {
  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateSimulationSpeed(Number(e.target.value));
  };

  return (
    <header className="dashboard-header">
      <div className="logo-container">
        <h1>Optify Dashboard</h1>
        <p className="subtitle">We don't care about your kids worker 17</p>
      </div>
      
      <div className="controls">
        <div className="simulation-status">
          <span className={`status-indicator ${runningSimulation ? 'active' : ''}`}></span>
          <span>Simulation: {runningSimulation ? 'Running' : 'Stopped'}</span>
        </div>
        
        <div className="simulation-speed">
          <label htmlFor="speed-selector">Update Speed:</label>
          <select 
            id="speed-selector" 
            value={simulationSpeed}
            onChange={handleSpeedChange}
            disabled={runningSimulation}
          >
            <option value="2000">Slow (2s)</option>
            <option value="1000">Normal (1s)</option>
            <option value="500">Fast (0.5s)</option>
            <option value="250">Very Fast (0.25s)</option>
          </select>
        </div>
        
        <div className="simulation-buttons">
          {!runningSimulation ? (
            <button className="start-button" onClick={startSimulation}>
              Start Simulation
            </button>
          ) : (
            <button className="stop-button" onClick={stopSimulation}>
              Stop Simulation
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader; 