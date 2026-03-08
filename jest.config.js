module.exports = {
  // Тестовая среда
  testEnvironment: 'jsdom',
  
  // Корневая директория
  roots: ['<rootDir>/src'],
  
  // Паттерны для поиска тестов
  testMatch: [
    '**/__tests__/**/*.js?(x)',
    '**/?(*.)+(spec|test).js?(x)',
    '**/tests/**/*.test.js',
  ],
  
  // Игнорировать директории
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
  ],
  
  // Трансформация файлов
  transform: {
    '^.+\\.js$': 'babel-jest',
  },
  
  // Модули для трансформации
  transformIgnorePatterns: [
    '/node_modules/(?!(puppeteer)/)',
  ],
  
  // Покрытие кода
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/**/__mocks__/**',
    '!src/index.js',
  ],
  
  // Директории для покрытия
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/dist/',
    '/coverage/',
  ],
  
  // Пороги покрытия
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
  
  // Репортеры покрытия
  coverageReporters: ['json', 'lcov', 'text', 'clover', 'html'],
  
  // Директория для отчетов о покрытии
  coverageDirectory: '<rootDir>/coverage',
  
  // Маппинг модулей
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/tests/__mocks__/styleMock.js',
  },
  

  
  // Очистка моков между тестами
  clearMocks: true,
  
  // Время ожидания тестов
  testTimeout: 10000,
  
  // Отключаем уведомления, так как они требуют node-notifier
  // notify: true,
  
  // Вербозность
  verbose: true,
  
  // Параллельное выполнение (1 = последовательное)
  maxWorkers: 1,
  
  // Глобальные переменные
  globals: {
    __DEV__: true,
  },
};