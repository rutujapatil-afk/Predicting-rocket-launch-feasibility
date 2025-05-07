import { Atom, Book, Gauge, Rocket, Wind } from 'lucide-react';
import { useEffect, useState } from 'react';

const topics = [
  {
    id: 'basics',
    title: 'Rocket Basics',
    icon: Rocket,
    description: 'Learn about the fundamental principles of rocketry and space flight.',
    content: `
      <h3>Basic Rocket Components</h3>
      <p>A rocket consists of several key components:</p>
      <ul>
        <li title="Fuel and oxidizer combined">🧪 <strong>Propellants:</strong> Fuel + Oxidizer mixture</li>
        <li title="Generate thrust by burning propellant">🚀 <strong>Engines and Nozzles:</strong> Create and channel thrust</li>
        <li title="Support structure and payload housing">🏗️ <strong>Structural Components:</strong> Provide physical integrity</li>
        <li title="Controls direction and orientation">🧭 <strong>Guidance Systems:</strong> Navigate and stabilize flight</li>
      </ul>

      <h4 class="mt-4">Everyday Analogies</h4>
      <ul>
        <li>🧪 Propellants → "Gasoline for rockets"</li>
        <li>🚀 Engine → "Car engine, but 100x more powerful"</li>
        <li>🏗️ Structure → "Like a soda can but super strong"</li>
        <li>🧭 Guidance → "Like autopilot in a plane"</li>
      </ul>

      <div class="mt-4 p-4 bg-orange-50 rounded">
        <strong>Historical Insight:</strong> The first successful liquid-fueled rocket was launched by Robert Goddard in 1926.
      </div>

      <h3 class="mt-6">Rocket Propulsion</h3>
      <p>
        Rockets generate thrust by expelling mass rapidly in the opposite direction of travel,
        in accordance with <strong>Newton's Third Law</strong>: "For every action, there's an equal and opposite reaction."
      </p>

      <div class="mt-4 p-4 bg-green-50 rounded">
        <strong>Fun Analogy:</strong> Imagine jumping off a skateboard—the board rolls backward while you leap forward.
        That's the basic idea of rocket propulsion!
      </div>

      <h4 class="mt-6">Why It Matters</h4>
      <p>Without proper structure, propulsion, or guidance, a rocket cannot reach its target orbit or return safely.</p>
    `,
    facts: [
      "Falcon 9 uses RP-1 (a refined kerosene) and liquid oxygen as propellants.",
      "The first liquid-fueled rocket was launched by Robert Goddard in 1926.",
      "Newton’s Third Law is the foundation of rocket propulsion.",
      "The Saturn V rocket used five F-1 engines on its first stage."
    ]
  },
  {
    id: 'propulsion',
    title: 'Propulsion Systems',
    icon: Atom,
    description: 'Explore different types of rocket engines and their working principles.',
    content: `
      <h3>Types of Rocket Engines</h3>
      <ul>
        <li>🔵 <strong>Liquid-Fueled:</strong> Combusts fuel and oxidizer in separate tanks</li>
        <li>🔴 <strong>Solid-Fueled:</strong> Fuel and oxidizer combined in a solid form</li>
        <li>🟠 <strong>Hybrid:</strong> Uses a liquid oxidizer and solid fuel</li>
        <li>🟣 <strong>Ion:</strong> Electrically accelerates ions for deep-space thrust</li>
      </ul>

      <h3 class="mt-6">Engine Comparison</h3>
      <table class="table-auto border-collapse w-full text-sm">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 border">Engine Type</th>
            <th class="p-2 border">Thrust</th>
            <th class="p-2 border">Efficiency (Isp)</th>
            <th class="p-2 border">Control</th>
            <th class="p-2 border">Reusability</th>
          </tr>
        </thead>
        <tbody>
          <tr><td class="p-2 border">Liquid</td><td class="p-2 border">High</td><td class="p-2 border">High</td><td class="p-2 border">✅</td><td class="p-2 border">✅</td></tr>
          <tr><td class="p-2 border">Solid</td><td class="p-2 border">Very High</td><td class="p-2 border">Low</td><td class="p-2 border">❌</td><td class="p-2 border">❌</td></tr>
          <tr><td class="p-2 border">Hybrid</td><td class="p-2 border">Medium</td><td class="p-2 border">Moderate</td><td class="p-2 border">⚠️</td><td class="p-2 border">⚠️</td></tr>
          <tr><td class="p-2 border">Ion</td><td class="p-2 border">Very Low</td><td class="p-2 border">Ultra High</td><td class="p-2 border">✅</td><td class="p-2 border">✅</td></tr>
        </tbody>
      </table>

      <h3 class="mt-6">Interactive Example</h3>
      <p>🔬 <em>Imagine adjusting a garden hose:</em> more pressure = more thrust. Throttling a rocket engine works similarly!</p>

      <div class="mt-4 p-4 bg-blue-50 rounded">
        <strong>Real Example:</strong> The RS-25 engines from the Space Shuttle are now being reused for NASA's SLS rocket.
      </div>

      <div id="propulsion-quiz" class="mt-4 p-4 bg-yellow-50 rounded">
        <strong>Quick Quiz:</strong> Which engine type is most efficient in deep space?
        <form id="quiz-form">
          <label><input type="radio" name="quiz" value="A" /> A) Solid</label><br />
          <label><input type="radio" name="quiz" value="B" /> B) Liquid</label><br />
          <label><input type="radio" name="quiz" value="C" /> C) Ion</label><br />
          <button type="submit" class="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Check Answer</button>
          <p id="quiz-feedback" class="mt-2 text-sm font-medium text-green-700 hidden">Correct! 🚀</p>
        </form>
      </div>
    `,
    facts: [
      "Ion engines use electric fields to accelerate ions for propulsion—very efficient, but low thrust.",
      "Liquid engines can be throttled, shut down, and restarted in flight.",
      "The shuttle main engines were reusable liquid hydrogen/liquid oxygen engines.",
      "Hybrid engines combine safety of solids and controllability of liquids."
    ]
  },
  {
    id: 'aerodynamics',
    title: 'Aerodynamics',
    icon: Wind,
    description: 'Understanding how rockets interact with the atmosphere during flight.',
    content: `
      <h3>Atmospheric Effects</h3>
      <p>Rockets must overcome:</p>
      <ul>
        <li>Drag forces</li>
        <li>Dynamic pressure</li>
        <li>Heat generation</li>
      </ul>
  
      <h3 class="mt-6">Rocket Airflow</h3>
      <svg width="100%" height="200" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg">
        <rect x="220" y="80" width="60" height="40" rx="8" fill="#4b5563" />
        <polygon points="280,80 300,100 280,120" fill="#1f2937" />
        <text x="215" y="75" font-size="12">Nose Cone</text>
        <text x="305" y="105" font-size="12">Shockwave</text>
        <path d="M 0 100 Q 150 50 220 100 Q 150 150 0 100" fill="none" stroke="#3b82f6" stroke-width="2" stroke-dasharray="4 2" />
      </svg>
  
      <p>Center of Gravity (CG) and Center of Pressure (CP) determine a rocket's stability:</p>
      <ul>
        <li>🟢 CG below CP → Stable</li>
        <li>🟡 CG and CP overlap → Marginal</li>
        <li>🔴 CG above CP → Unstable</li>
      </ul>
  
      <h3 class="mt-6">Mini Quiz</h3>
      <p><strong>What happens if the center of pressure is above the center of gravity?</strong></p>
      <form id="aero-quiz" class="mt-2">
        <label><input type="radio" name="aero" value="A" /> A) More stable</label><br />
        <label><input type="radio" name="aero" value="B" /> B) Less stable</label><br />
        <label><input type="radio" name="aero" value="C" /> C) It doesn’t matter</label><br />
        <button type="submit" class="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Check Answer</button>
        <p id="aero-feedback" class="hidden mt-2 text-sm"></p>
      </form>
  
      <div class="mt-6 p-4 bg-pink-50 border-l-4 border-pink-400 rounded">
        <strong>Myth Buster:</strong><br/>
        “More fins = more stable?” ❌<br/>
        “Rockets always fly straight up?” ❌<br/>
        “Supersonic drag is always higher?” 🔄 Depends on shape!
      </div>
    `,
    facts: [
      "Rockets experience max aerodynamic pressure (Max Q) shortly after launch.",
      "Fin design plays a crucial role in keeping the rocket stable in flight.",
      "Ascent through the thick lower atmosphere is the most drag-intensive phase."
    ]
  },      
  {
    id: 'performance',
    title: 'Performance Analysis',
    icon: Gauge,
    description: 'Learn about rocket performance calculations and optimization.',
    content: `
      <h3>Key Performance Metrics</h3>
      <ul>
        <li>Delta-v requirements</li>
        <li>Payload capacity</li>
        <li>Stage separation timing</li>
        <li>Orbital parameters</li>
      </ul>

      <h3 class="mt-6">Mission Planning</h3>
      <p>Understanding launch windows, trajectory optimization, and fuel requirements.</p>

      <h3 class="mt-6">Try It Yourself: Delta-v Calculator</h3>
      <p><strong>Enter your rocket data below:</strong></p>
      <form id="dv-form" class="mt-2">
        <label>Initial Mass (kg): <input type="number" name="m0" required class="border rounded px-2 py-1 ml-2" /></label><br/><br/>
        <label>Final Mass (kg): <input type="number" name="mf" required class="border rounded px-2 py-1 ml-2" /></label><br/><br/>
        <label>Specific Impulse (Isp in s): <input type="number" name="isp" required class="border rounded px-2 py-1 ml-2" /></label><br/><br/>
        <button type="submit" class="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Calculate Δv</button>
        <p id="dv-feedback" class="mt-3 text-blue-800 font-medium hidden"></p>
      </form>

      <div class="mt-6 p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded">
        <strong>Did You Know?</strong><br/>
        The Saturn V's first stage produced enough Delta-v to lift the entire rocket 68 km into the sky in just 2.5 minutes!
      </div>
    `,

    facts: [
      "Delta-v is the key indicator of how far or fast a spacecraft can go.",
      "Multistage rockets increase efficiency by discarding excess mass.",
      "Orbital mechanics govern everything from launch timing to satellite insertion."
    ]
  }
];


export default function StudyRocketScience() {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  const [selectedFact, setSelectedFact] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTopic.facts && selectedTopic.facts.length > 0) {
      const random = Math.floor(Math.random() * selectedTopic.facts.length);
      setSelectedFact(selectedTopic.facts[random]);
    } else {
      setSelectedFact(null);
    }
  
    setTimeout(() => {
      // Ion propulsion quiz
      const propulsionForm = document.getElementById('quiz-form') as HTMLFormElement | null;
      const propulsionFeedback = document.getElementById('quiz-feedback') as HTMLParagraphElement | null;
      if (propulsionForm && propulsionFeedback) {
        propulsionForm.onsubmit = (e) => {
          e.preventDefault();
          const formData = new FormData(propulsionForm);
          const answer = formData.get('quiz');
          if (answer === 'C') {
            propulsionFeedback.textContent = 'Correct! 🚀';
            propulsionFeedback.classList.remove('hidden', 'text-red-600');
            propulsionFeedback.classList.add('text-green-700');
          } else {
            propulsionFeedback.textContent = 'Oops! The correct answer is C) Ion.';
            propulsionFeedback.classList.remove('hidden', 'text-green-700');
            propulsionFeedback.classList.add('text-red-600');
          }
        };
      }
  
      // Aerodynamics CP/CG stability quiz
      const aeroForm = document.getElementById('aero-quiz') as HTMLFormElement | null;
      const aeroFeedback = document.getElementById('aero-feedback') as HTMLParagraphElement | null;
      if (aeroForm && aeroFeedback) {
        aeroForm.onsubmit = (e) => {
          e.preventDefault();
          const formData = new FormData(aeroForm);
          const answer = formData.get('aero');
          aeroFeedback.classList.remove('hidden');
          if (answer === 'B') {
            aeroFeedback.textContent = '✅ Correct! It becomes less stable.';
            aeroFeedback.className = 'text-green-600 mt-2 text-sm';
          } else {
            aeroFeedback.textContent = '❌ Incorrect. When CP is above CG, rockets become less stable.';
            aeroFeedback.className = 'text-red-600 mt-2 text-sm';
          }
        };
      }
  
      // Delta-v calculator logic
      const dvForm = document.getElementById('dv-form') as HTMLFormElement | null;
      const dvFeedback = document.getElementById('dv-feedback') as HTMLParagraphElement | null;
      if (dvForm && dvFeedback) {
        dvForm.onsubmit = (e) => {
          e.preventDefault();
          const formData = new FormData(dvForm);
          const m0 = parseFloat(formData.get('m0') as string);
          const mf = parseFloat(formData.get('mf') as string);
          const isp = parseFloat(formData.get('isp') as string);
          const g0 = 9.80665; // standard gravity
  
          if (m0 > mf && isp > 0) {
            const deltaV = isp * g0 * Math.log(m0 / mf);
            dvFeedback.textContent = `Δv = ${deltaV.toFixed(2)} m/s`;
            dvFeedback.classList.remove('hidden', 'text-red-600');
            dvFeedback.classList.add('text-blue-800');
          } else {
            dvFeedback.textContent = 'Invalid input: ensure m0 > mf and Isp > 0';
            dvFeedback.classList.remove('hidden', 'text-blue-800');
            dvFeedback.classList.add('text-red-600');
          }          
        };
      }
    }, 100);
  }, [selectedTopic]);
  

  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center">
          <Book className="h-8 w-8 text-blue-600" />
          <h1 className="ml-3 text-2xl font-bold text-gray-900">Study Rocket Science</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Explore comprehensive lessons on rocket science fundamentals and advanced concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-4">
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedTopic.id === topic.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <Icon className="h-5 w-5 text-blue-600" />
                  <span className="ml-2 font-medium">{topic.title}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedTopic.title}</h2>
            <p className="text-gray-600 mb-6">{selectedTopic.description}</p>

            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedTopic.content }}
            />

            {selectedFact && (
              <div className="mt-6 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 rounded-md">
                <strong>Did You Know?</strong> {selectedFact}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
