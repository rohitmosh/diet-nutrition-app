import { IS_DEMO } from '../services/api';

const DemoBanner = () => {
  if (!IS_DEMO) return null;

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 text-center">
      <p className="font-medium">
        🚀 Demo Mode - All data is simulated for demonstration purposes
      </p>
    </div>
  );
};

export default DemoBanner;