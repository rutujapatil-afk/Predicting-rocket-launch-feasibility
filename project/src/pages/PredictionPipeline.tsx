import { useState } from 'react';
import { Baseline as Pipeline, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const steps = [
  { id: 'weather', title: 'Weather Prediction', status: 'pending' },
  { id: 'trajectory', title: 'Trajectory Simulation', status: 'pending' },
  { id: 'cost', title: 'Cost Estimation', status: 'pending' },
  { id: 'risk', title: 'Risk Assessment', status: 'pending' },
  { id: 'landing', title: 'Stage 1 Landing', status: 'pending' }
];

export default function PredictionPipeline() {
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const runPipeline = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setResults({});

    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      
      // Simulate API call for each step
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock results for each step
      const mockResults = {
        weather: {
          suitable: true,
          confidence: 0.85,
          conditions: { temperature: 22, wind: 5, precipitation: 0 }
        },
        trajectory: {
          success: true,
          maxAltitude: 150,
          stageSeparation: [62, 125]
        },
        cost: {
          total: 62000000,
          breakdown: { vehicle: 45000000, operations: 12000000, insurance: 5000000 }
        },
        risk: {
          level: 'Low',
          confidence: 0.92,
          factors: ['Vehicle proven', 'Good weather', 'Standard orbit']
        },
        landing: {
          success_probability: 0.87,
          recommendation: 'Proceed with landing attempt'
        }
      };

      setResults((prev) => ({
        ...prev,
        [steps[i].id]: mockResults[steps[i].id]
      }));
    }

    setIsRunning(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Pipeline className="h-8 w-8 text-blue-600" />
          <h1 className="ml-3 text-2xl font-bold text-gray-900">Full Prediction Pipeline</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Run a complete analysis combining all our prediction models for comprehensive launch assessment.
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900">Pipeline Progress</h2>
          <Button
            onClick={runPipeline}
            disabled={isRunning}
          >
            {isRunning ? 'Running Pipeline...' : 'Start Pipeline'}
          </Button>
        </div>

        <div className="space-y-4">
          {steps.map((step, index) => {
            const isActive = currentStep === index;
            const isComplete = results[step.id];
            
            return (
              <div key={step.id} className="relative">
                {index > 0 && (
                  <div className="absolute top-0 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                )}
                <div className="relative flex items-start group">
                  <div className="flex h-9 items-center">
                    <div className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full ${
                      isComplete
                        ? 'bg-green-500'
                        : isActive
                        ? 'bg-blue-500'
                        : 'bg-gray-200'
                    }`}>
                      <ArrowRight className={`h-5 w-5 ${
                        isComplete || isActive ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                  </div>
                  <div className="ml-4 min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900">{step.title}</div>
                    {results[step.id] && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-md">
                        <pre className="text-sm whitespace-pre-wrap">
                          {JSON.stringify(results[step.id], null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}