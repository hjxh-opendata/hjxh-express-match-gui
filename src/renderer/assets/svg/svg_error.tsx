export const SvgError = () => (
  <svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit css-1cw4hi4"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    data-testid="ErrorOutlineIcon"
  >
    <path d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
  </svg>
);

export const SvgWarn = () => (
  <svg
    className="MuiSvgIcon-root MuiSvgIcon-fontSizeInherit css-1cw4hi4"
    focusable="false"
    viewBox="0 0 24 24"
    aria-hidden="true"
    data-testid="ReportProblemOutlinedIcon"
  >
    <path d="M12 5.99L19.53 19H4.47L12 5.99M12 2L1 21h22L12 2zm1 14h-2v2h2v-2zm0-6h-2v4h2v-4z" />
  </svg>
);

export default {
  SvgError,
  SvgWarn,
};
