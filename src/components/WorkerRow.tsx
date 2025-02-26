import { Worker } from '../utils/workerSimulation';

interface WorkerRowProps {
  worker: Worker;
}

const WorkerRow = ({ worker }: WorkerRowProps) => {
  // Determine energy level visual indicator class
  const getEnergyClass = (energy: number) => {
    if (energy < 40) return 'energy-low';
    if (energy < 70) return 'energy-medium';
    return 'energy-high';
  };
  
  // Determine quality level visual indicator class
  const getQualityClass = (quality: number) => {
    if (quality < 70) return 'quality-low';
    if (quality < 85) return 'quality-medium';
    return 'quality-high';
  };

  return (
    <div className={`worker-row ${worker.workerNumber === 17 ? 'problem-worker' : ''}`}>
      <div className="worker-column name-column">
        <span className="worker-number">#{worker.workerNumber}</span> {worker.name}
      </div>
      
      <div className="worker-column rate-column">
        <div className="metric-value">{worker.productivityRate.toFixed(1)}</div>
        <div className="metric-label">items/hr</div>
        
        {/* Small productivity trend indicator */}
        {worker.performance.length > 1 && (
          <div className={`trend-indicator ${
            worker.performance[worker.performance.length - 1] > worker.performance[worker.performance.length - 2]
              ? 'trend-up'
              : 'trend-down'
          }`}>
            {worker.performance[worker.performance.length - 1] > worker.performance[worker.performance.length - 2]
              ? '↑'
              : '↓'}
          </div>
        )}
      </div>
      
      <div className="worker-column quality-column">
        <div className={`quality-indicator ${getQualityClass(worker.qualityRate)}`}>
          {worker.qualityRate.toFixed(1)}%
        </div>
      </div>
      
      <div className="worker-column energy-column">
        <div className="energy-bar-container">
          <div 
            className={`energy-bar ${getEnergyClass(worker.energyLevel)}`}
            style={{ width: `${worker.energyLevel}%` }}
          ></div>
        </div>
        <div className="energy-value">{worker.energyLevel.toFixed(0)}%</div>
      </div>
      
      <div className="worker-column total-column">
        {worker.totalProduced}
      </div>
      
      <div className="worker-column defect-column">
        {worker.defects}
        <span className="defect-rate">
          ({worker.totalProduced > 0 
            ? ((worker.defects / worker.totalProduced) * 100).toFixed(1) 
            : '0.0'}%)
        </span>
      </div>
    </div>
  );
};

export default WorkerRow; 