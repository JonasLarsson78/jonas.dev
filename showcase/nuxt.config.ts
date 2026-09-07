export default defineNuxtConfig({
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    public: {
      demoVue:        process.env.DEMO_VUE_URL        || 'http://localhost:3001',
      demoReact:      process.env.DEMO_REACT_URL      || 'http://localhost:3002',
      demoNodeApi:    process.env.DEMO_NODE_API_URL   || 'http://localhost:3003',
      demoAi:         process.env.DEMO_AI_URL         || 'http://localhost:3004',
      demoTypescript: process.env.DEMO_TS_URL         || 'http://localhost:3005',
      demoGraphql:    process.env.DEMO_GRAPHQL_URL    || 'http://localhost:3006',
      demoAuth:       process.env.DEMO_AUTH_URL       || 'http://localhost:3007',
      demoMysql:      process.env.DEMO_MYSQL_URL      || 'http://localhost:3008',
      demoDocker:     process.env.DEMO_DOCKER_URL     || 'http://localhost:3009',
    },
  },

  app: {
    head: {
      title: 'Jonas Larsson — Developer Portfolio',
      meta: [
        { name: 'description', content: 'Interactive developer portfolio — see the code, not just the CV' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap' }
      ]
    }
  },
  compatibilityDate: '2024-11-01'
})
