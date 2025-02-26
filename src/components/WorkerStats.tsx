import { Worker } from '../utils/workerSimulation';

interface WorkerStatsProps {
  workers: Worker[];
}

const WorkerStats = ({ workers }: WorkerStatsProps) => {
  // Calculate statistics
  const totalWorkers = workers.length;
  const totalProduced = workers.reduce((sum, worker) => sum + worker.totalProduced, 0);
  const totalDefects = workers.reduce((sum, worker) => sum + worker.defects, 0);
  
  const avgProductivity = workers.length 
    ? workers.reduce((sum, worker) => sum + worker.productivityRate, 0) / workers.length 
    : 0;
    
  const avgQuality = workers.length 
    ? workers.reduce((sum, worker) => sum + worker.qualityRate, 0) / workers.length 
    : 0;
    
  const avgEnergy = workers.length 
    ? workers.reduce((sum, worker) => sum + worker.energyLevel, 0) / workers.length 
    : 0;
  
  const defectRate = totalProduced > 0 
    ? (totalDefects / totalProduced) * 100 
    : 0;
    
  // Find top performer (by productivity)
  const topPerformer = workers.length 
    ? workers.reduce((best, current) => 
        current.productivityRate > best.productivityRate ? current : best, 
        workers[0]) 
    : null;
  
  // Find worker that needs attention (lowest energy)
  const needsAttention = workers.length 
    ? workers.reduce((worst, current) => 
        current.energyLevel < worst.energyLevel ? current : worst, 
        workers[0]) 
    : null;

  return (
    <div className="worker-stats">
      <h2>Production Statistics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Workers</h3>
          <p className="stat-value">{totalWorkers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Production</h3>
          <p className="stat-value">{totalProduced}</p>
          <p className="stat-subtitle">Total items</p>
        </div>
        
        <div className="stat-card">
          <h3>Quality</h3>
          <p className="stat-value">{avgQuality.toFixed(1)}%</p>
          <p className="stat-subtitle">{defectRate.toFixed(1)}% defect rate</p>
        </div>
        
        <div className="stat-card">
          <h3>Productivity</h3>
          <p className="stat-value">{avgProductivity.toFixed(1)}</p>
          <p className="stat-subtitle">items/hour avg</p>
        </div>
        
        <div className="stat-card">
          <h3>Energy Level</h3>
          <p className="stat-value">{avgEnergy.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="worker-highlights">
        {topPerformer && (
          <div className="highlight-card top-performer">
            <h3>Top Performer</h3>
            <p className="highlighted-name">{topPerformer.name}</p>
            <p>{topPerformer.productivityRate.toFixed(1)} items/hour</p>
          </div>
        )}
        
        {needsAttention && (
          <div className="highlight-card needs-attention">
            <h3>Needs Break</h3>
            <p className="highlighted-name">{needsAttention.name}</p>
            <p>Energy: {needsAttention.energyLevel.toFixed(1)}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerStats; 