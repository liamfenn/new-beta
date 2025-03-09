# RxReality: Virtual ICU Simulation

A medical simulation application for training healthcare professionals in ICU scenarios. This immersive 3D environment allows users to practice clinical decision-making in a realistic setting with AI-powered feedback.

## Overview

RxReality is an interactive web-based simulation designed to help medical students, residents, and healthcare professionals develop and refine their clinical reasoning skills in critical care scenarios. Users navigate a virtual ICU environment, interact with patients and staff, review medical information, and make evidence-based clinical recommendations.

## Features

### Immersive 3D Environment
- First-person navigation using WASD keys and mouse look
- Interactive elements including patient room, EHR terminal, patient bed, and nurse station
- Visual prompts for interactive elements
- Realistic hospital environment with proper scaling and medical equipment

### Electronic Health Record (EHR) System
- Comprehensive patient information including demographics, history, and vitals
- Lab results and imaging reports
- Medication lists and treatment history
- Organized in tabs for easy navigation

### AI-Powered Clinical Decision Evaluation
- Free-text clinical recommendation input
- Real-time AI evaluation of clinical decisions using OpenAI's API
- Color-coded feedback (green/yellow/red) based on recommendation quality
- Detailed feedback explaining strengths and weaknesses
- Specific suggestions for improvement

### Interactive Nurse Consultation
- Chat-based interface for consulting with the nursing staff
- AI-powered nurse responses based on the patient scenario
- Ability to ask follow-up questions and gather additional information
- Realistic nursing insights not found in the EHR

### Patient Examination
- Detailed patient examination findings
- Current vital signs and physical examination results
- Patient-reported symptoms
- Critical information for clinical assessment

### Guided Learning Experience
- Step-by-step task progression
- Guidance overlay with contextual instructions
- Task list to track progress
- Timed scenarios (10 minutes) with color-changing timer
- Comprehensive feedback on performance

### Productivity Tools
- Command menu (⌘+K) for quick access to all features
- Notepad for taking notes during the simulation
- Task list to track progress
- Scenario information and guide accessible at any time

## Technologies Used

- **Frontend**: React with Vite for fast development
- **3D Rendering**: Three.js with React Three Fiber
- **UI Components**: Tailwind CSS with shadcn/ui component library
- **AI Integration**: OpenAI API for nurse consultation and clinical decision evaluation
- **State Management**: React hooks and context
- **Styling**: Tailwind CSS for responsive design
- **Animations**: CSS transitions and Three.js animations

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/rxreality.git
cd rxreality
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Add your OpenAI API key to the `.env` file:
   ```
   VITE_OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server:
```bash
npm run dev
```

5. Build for production:
```bash
npm run build
```

## Usage

1. **Start the simulation** by clicking "Get Started" on the welcome screen
2. **Navigate the environment** using WASD keys and mouse movement
3. **Interact with objects** by pressing E when prompted
4. **Complete tasks** in the following order:
   - Enter the patient's room
   - Review the patient's EHR
   - Examine the patient
   - Consult with the nurse
   - Make a clinical recommendation
5. **Access tools** using the command menu (⌘+K) or keyboard shortcuts:
   - Task List: View current tasks and progress
   - Notepad: Take notes during the simulation
   - Scenario Info: Review the patient scenario
   - Guide: Access the user guide
6. **Make your recommendation** after gathering all necessary information
7. **Review feedback** on your clinical decision

## Keyboard Shortcuts

- **W, A, S, D**: Move around the environment
- **Mouse**: Look around
- **E**: Interact with objects and people
- **ESC**: Exit any interaction
- **⌘+K** (Mac) or **Ctrl+K** (Windows): Open command menu
- **R**: Make clinical recommendation (after completing all tasks)

## Project Structure

```
rxreality/
├── public/             # Static assets
│   └── assets/         # Images, videos, and 3D models
├── src/                # Source code
│   ├── components/     # React components
│   │   ├── ui/         # UI components from shadcn/ui
│   │   └── ...         # Application-specific components
│   ├── lib/            # Utility functions and helpers
│   └── App.jsx         # Main application component
├── .env.example        # Example environment variables
├── index.html          # HTML entry point
└── package.json        # Project dependencies and scripts
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- shadcn/ui for the beautiful component library
- Three.js and React Three Fiber for 3D rendering capabilities
- OpenAI for the API powering the AI features
