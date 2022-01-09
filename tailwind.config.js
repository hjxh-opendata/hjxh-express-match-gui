module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    minWidth: {
      '1/2': '50%',
    },
  },
  plugins: [],
  important: true,
  // todo: purge specific paths
  purge: false,
};
