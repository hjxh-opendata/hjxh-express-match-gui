module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {},
    minWidth: {
      '1/2': '50%',
      '3/4': '75%',
      '.9': '90%',
      '9/10': '90%',
    },
  },
  plugins: [],
  important: true,
  // todo: purge specific paths
  purge: false,
};
