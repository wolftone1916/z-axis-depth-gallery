// Sample project data
const projectsData = [
    {
        id: 1,
        number: '001',
        title: 'Neural Interface',
        emoji: '🧠',
        description: 'Advanced neural network visualization showcasing real-time data processing and AI decision-making pathways.',
        tags: ['AI', 'Neural Networks', 'Visualization'],
        details: 'This project demonstrates cutting-edge neural interface technology with interactive 3D visualizations of deep learning processes.'
    },
    {
        id: 2,
        number: '002',
        title: 'Quantum Processor',
        emoji: '⚛️',
        description: 'Quantum computing platform featuring qubit state management and entanglement visualization.',
        tags: ['Quantum', 'Computing', 'Physics'],
        details: 'Explore the fundamentals of quantum computing with interactive visualizations of quantum gates and algorithms.'
    },
    {
        id: 3,
        number: '003',
        title: 'Digital Nexus',
        emoji: '🌐',
        description: 'Global network infrastructure displaying real-time data flows and connectivity patterns.',
        tags: ['Network', 'Infrastructure', 'Cloud'],
        details: 'A comprehensive view of distributed systems and network topology in real-time visualization.'
    },
    {
        id: 4,
        number: '004',
        title: 'Holographic Display',
        emoji: '🔮',
        description: 'Next-generation holographic interface with gesture-based controls and spatial rendering.',
        tags: ['AR/VR', 'Interface', 'Holography'],
        details: 'Experience the future of human-computer interaction with advanced holographic display technology.'
    },
    {
        id: 5,
        number: '005',
        title: 'Energy Matrix',
        emoji: '⚡',
        description: 'Real-time energy distribution and power management system for sustainable infrastructure.',
        tags: ['Energy', 'Sustainability', 'IoT'],
        details: 'Monitor and optimize energy consumption across smart grids and renewable energy sources.'
    },
    {
        id: 6,
        number: '006',
        title: 'Cybersecurity Hub',
        emoji: '🛡️',
        description: 'Advanced threat detection and network security monitoring with predictive analytics.',
        tags: ['Security', 'Analytics', 'Protection'],
        details: 'Real-time security monitoring with AI-powered threat detection and response systems.'
    }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { projectsData };
}
