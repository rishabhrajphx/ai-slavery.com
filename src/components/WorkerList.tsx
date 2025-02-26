import { Worker } from '../utils/workerSimulation';
import WorkerRow from './WorkerRow';

interface WorkerListProps {
  workers: Worker[];
}

const WorkerList = ({ workers }: WorkerListProps) => {
  // Sort workers by productivity (highest first)
  const sortedWorkers = [...workers].sort((a, b) => 
    b.productivityRate - a.productivityRate
  );

  return (
    <div className="worker-list-container">
      <h2>Worker Performance</h2>
      
      <div className="worker-list-header">
        <div className="worker-column name-column">Name</div>
        <div className="worker-column rate-column">Productivity</div>
        <div className="worker-column quality-column">Quality</div>
        <div className="worker-column energy-column">Energy</div>
        <div className="worker-column total-column">Total Produced</div>
        <div className="worker-column defect-column">Defects</div>
      </div>
      
      <div className="worker-list">
        {sortedWorkers.map(worker => (
          <WorkerRow key={worker.id} worker={worker} />
        ))}
      </div>
    </div>
  );
};

export default WorkerList; 