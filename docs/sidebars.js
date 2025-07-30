/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: 'Introduction',
    },
    {
      type: 'category',
      label: 'API Reference',
      link: {
        type: 'doc',
        id: 'category/api-reference',
      },
      items: [
        {
          type: 'doc',
          id: 'api/game-api',
          label: 'Game API',
        },
        {
          type: 'doc',
          id: 'api/ai-api',
          label: 'AI API',
        },
        {
          type: 'doc',
          id: 'api/testing-api',
          label: 'Testing API',
        },
        {
          type: 'doc',
          id: 'api/screenshot-api',
          label: 'Screenshot API',
        },
        {
          type: 'doc',
          id: 'api/configuration-api',
          label: 'Configuration API',
        },
      ],
    },
    {
      type: 'category',
      label: 'Testing',
      link: {
        type: 'doc',
        id: 'category/testing',
      },
      items: [
        {
          type: 'doc',
          id: 'testing/unit-testing',
          label: 'Unit Testing',
        },
        {
          type: 'doc',
          id: 'testing/headless-simulation',
          label: 'Headless Simulation',
        },
        {
          type: 'doc',
          id: 'testing/screenshot-testing',
          label: 'Screenshot Testing',
        },
        {
          type: 'doc',
          id: 'testing/performance-testing',
          label: 'Performance Testing',
        },
        {
          type: 'doc',
          id: 'testing/integration-testing',
          label: 'Integration Testing',
        },
      ],
    },
  ],
};

module.exports = sidebars; 