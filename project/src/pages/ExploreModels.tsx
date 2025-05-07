import { Button } from '@/components/ui/Button';
import {
  AlertTriangle,
  Cloud,
  DollarSign,
  FlaskRound as Flask,
  Plane
} from 'lucide-react';
import { useState } from 'react';
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';


const models = [
  {
    id: 'weather',
    title: 'Weather Prediction',
    icon: Cloud,
    description: 'Predict launch site weather conditions and launch suitability.',
    inputs: [
      { id: 'site', label: 'Launch Site', type: 'select', options: ['Cape Canaveral', 'Kennedy Space Center', 'Vandenberg'] },
      { id: 'date', label: 'Launch Date', type: 'date' }
    ]
  },
  {
    id: 'trajectory',
    title: 'Trajectory Simulation',
    icon: LineChart,
    description: 'Simulate rocket trajectory and stage separation.',
    inputs: [
      { id: 'launch_site', label: 'Launch Site', type: 'select', options: ['Kennedy', 'Vandenberg', 'Cape Canaveral'] },
      { id: 'payload_mass_kg', label: 'Payload Mass (kg)', type: 'number' },
      { id: 'orbit_type', label: 'Orbit Type', type: 'select', options: ['LEO', 'SSO', 'GEO', 'MEO', 'Polar'] }
    ]    
  },  
  {
    id: 'cost',
    title: 'Cost Estimation',
    icon: DollarSign,
    description: 'Estimate launch costs based on mission parameters.',
    inputs: [
      { id: 'PayloadMass', label: 'Payload Mass (kg)', type: 'number' },
      { id: 'ReusedBooster', label: 'Reused Booster', type: 'select', options: ['Yes', 'No'] },
      { id: 'GridFins', label: 'Grid Fins', type: 'select', options: ['Yes', 'No'] },
      { id: 'Legs', label: 'Legs', type: 'select', options: ['Yes', 'No'] },
      { id: 'Orbit', label: 'Orbit', type: 'select', options: ['LEO', 'GTO', 'SSO', 'ISS'] },
      { id: 'Block', label: 'Block Version', type: 'number' },
      { id: 'ReusedCount', label: 'Reused Count', type: 'number' },
      { id: 'LandingType', label: 'Landing Type', type: 'select', options: ['RTLS', 'ASDS', 'Ocean'] },
      { id: 'LandingSuccess', label: 'Landing Success', type: 'select', options: ['Yes', 'No'] }
    ]
  },
  {
    id: 'risk',
    title: 'Risk Assessment',
    icon: AlertTriangle,
    description: 'Analyze mission risks and safety factors.',
    inputs: [
      { id: 'Flights', label: 'Flights', type: 'number' },
      { id: 'Block', label: 'Block Version', type: 'number' },
      { id: 'ReusedCount', label: 'Reused Count', type: 'number' },
      { id: 'Serial', label: 'Rocket Serial Number', type: 'text' },
      { id: 'LandingPad', label: 'Landing Pad ID', type: 'text' },
      { id: 'EstimatedLaunchCost_MillionUSD', label: 'Launch Cost (Million USD)', type: 'number' },
      { id: 'Location', label: 'Launch Location', type: 'select', options: ['Cape Canaveral', 'Kennedy Space Center', 'Vandenberg'] }
    ]
  },
  {
    id: 'landing',
    title: 'Stage 1 Landing',
    icon: Plane,
    description: 'Predict first stage landing success probability.',
    inputs: []
  }
];

export default function ExploreModels() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [prediction, setPrediction] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (id: string, value: string, type: string) => {
    if (type === 'number') {
      const parsed = parseFloat(value);
      setFormData((prev) => ({ ...prev, [id]: isNaN(parsed) ? undefined : parsed }));
    } else {
      setFormData((prev) => ({ ...prev, [id]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let url = '';
      let payload: any = {};

      if (selectedModel.id === 'weather') {
        url = 'http://localhost:8000/predict/weather';
        payload = {
          site: formData['site'],
          date: formData['date']
        };
      } else if (selectedModel.id === 'cost') {
        url = 'http://localhost:8000/predict/cost';
        payload = formData;
      } else if (selectedModel.id === 'risk') {
        url = 'http://localhost:8000/predict/risk';
        payload = formData;
      } else if (selectedModel.id === 'trajectory') {
        url = 'http://localhost:8000/predict/trajectory';
        payload = {
          launch_site: formData['launch_site'],
          payload_mass_kg: formData['payload_mass_kg'],
          orbit_type: formData['orbit_type']
        };
      } else {
        console.warn('Model not integrated yet.');
        return;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      console.error('Prediction failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Flask className="h-8 w-8 text-blue-600" />
          <h1 className="ml-3 text-2xl font-bold text-gray-900">Explore ML Models</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Interact with our machine learning models to predict various aspects of rocket launches.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <button
                key={model.id}
                onClick={() => {
                  setSelectedModel(model);
                  setPrediction(null);
                  setFormData({});
                }}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedModel.id === model.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 font-medium">{model.title}</span>
                </div>
                <p className="mt-1 text-sm text-gray-600">{model.description}</p>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{selectedModel.title}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {selectedModel.inputs.map((input) => (
                <div key={input.id}>
                  <label htmlFor={input.id} className="block text-sm font-medium text-gray-700">
                    {input.label}
                  </label>
                  <div className="mt-1">
                    {input.type === 'select' ? (
                      <select
                        id={input.id}
                        value={formData[input.id] ?? ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value, input.type)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="">Select...</option>
                        {input.options.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={input.type}
                        step={input.type === 'number' ? 'any' : undefined}
                        min={input.type === 'number' ? 0 : undefined}
                        id={input.id}
                        value={formData[input.id] ?? ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value, input.type)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                    )}
                  </div>
                </div>
              ))}
              <Button type="submit" disabled={isLoading} className="w-full mt-4">
                {isLoading ? 'Processing...' : 'Run Prediction'}
              </Button>
            </form>

            {/* Weather Results */}
            {prediction && selectedModel.id === 'weather' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prediction Results</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
                  <div>
                    <p>
                      <span className="font-medium">Launch Suitability:</span>{' '}
                      {prediction.suitable ? (
                        <span className="text-green-600">Suitable</span>
                      ) : (
                        <span className="text-red-600">Not Suitable</span>
                      )}
                    </p>
                    <ul className="pl-4 list-disc mt-2">
                      <li>Temperature: {prediction.conditions.temperature}°C</li>
                      <li>Wind Speed: {prediction.conditions.wind} m/s</li>
                      <li>Precipitation: {prediction.conditions.precipitation} mm</li>
                    </ul>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Confidence', value: prediction.confidence * 100 },
                            { name: 'Remaining', value: 100 - prediction.confidence * 100 }
                          ]}
                          innerRadius={40}
                          outerRadius={60}
                          dataKey="value"
                        >
                          <Cell fill="#3b82f6" />
                          <Cell fill="#e5e7eb" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <p className="mt-2 text-center font-medium">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cost Results */}
            {prediction && selectedModel.id === 'cost' && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-800">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Estimated Launch Cost</h3>
                <p className="text-blue-600 font-semibold text-lg">
                  💰 ${prediction.total.toLocaleString()}
                </p>
                <div className="mt-2 border-t pt-2">
                  <p className="font-medium mb-1">Breakdown:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>🚀 Vehicle: ${prediction.breakdown.vehicle.toLocaleString()}</li>
                    <li>🛠️ Operations: ${prediction.breakdown.operations.toLocaleString()}</li>
                    <li>📦 Insurance: ${prediction.breakdown.insurance.toLocaleString()}</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Risk Results */}
            {prediction && selectedModel.id === 'risk' && (
              <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm text-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Risk Assessment</h3>
                <p className="text-lg">
                  ⚠️ Risk Level:{' '}
                  <span
                    className={`font-bold ${
                      prediction.risk_level === 'HighRisk'
                        ? 'text-red-600'
                        : prediction.risk_level === 'MediumRisk'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {prediction.risk_level}
                  </span>
                </p>
                <p className="mt-1">Confidence: {(prediction.confidence * 100).toFixed(2)}%</p>
                <div className="mt-2">
                  <p className="font-medium mb-1">Class Probabilities:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    {Object.entries(prediction.probabilities).map(([label, value]) => (
                      <li key={label}>
                        {label}: {(value * 100).toFixed(2)}%
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Trajectory Results (Text Output) */}
            {prediction && selectedModel.id === 'trajectory' && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-800">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trajectory Summary</h3>
                <p><strong>Inclination:</strong> {prediction.orbit_summary.inclination.toFixed(2)}°</p>
                <p><strong>Apoapsis:</strong> {prediction.orbit_summary.apoapsis_km.toFixed(2)} km</p>
                <p><strong>Periapsis:</strong> {prediction.orbit_summary.periapsis_km.toFixed(2)} km</p>
                <p><strong>Eccentricity:</strong> {prediction.orbit_summary.eccentricity.toFixed(4)}</p>
                <p><strong>Orbit Status:</strong> {prediction.orbit_summary.achieved ? '✅ Achieved' : '❌ Not Achieved'}</p>
                {!prediction.orbit_summary.achieved && (
                  <div className="mt-2">
                    <p className="font-medium">Recommendations:</p>
                    <ul className="list-disc ml-6">
                      {prediction.orbit_summary.recommendations.map((rec: string, idx: number) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 📈 Altitude vs Time */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">📈 Altitude vs Time</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prediction.telemetry}>
                      <XAxis dataKey="time" tickFormatter={(v) => `${v}s`} />
                      <YAxis tickFormatter={(v) => `${(v / 1000).toFixed(1)} km`} />
                      <Tooltip formatter={(v) => `${(v / 1000).toFixed(2)} km`} labelFormatter={(label) => `Time: ${label}s`} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="altitude_m" stroke="#3b82f6" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                {/* 🗺️ Ground Track Map */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-2">🗺️ Ground Track Map</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={prediction.telemetry}>
                      <XAxis dataKey="longitude" tickFormatter={(v) => `${v.toFixed(1)}°`} />
                      <YAxis dataKey="latitude" tickFormatter={(v) => `${v.toFixed(1)}°`} />
                      <Tooltip formatter={(v) => `${v.toFixed(2)}°`} labelFormatter={() => 'Position'} />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Line type="monotone" dataKey="latitude" stroke="#10b981" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
