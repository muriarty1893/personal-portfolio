import EvilEye from './EvilEye';
import './EvilEyeButton.css';

function EvilEyeButton({
  children = 'I SEE YOU',
  className = '',
  labelClassName = '',
  effectClassName = '',
  effectOpacity = 0.95,
  ...eyeProps
}) {
  return (
    <button className={`evil-eye-button ${className}`.trim()} type="button">
      <span
        className={`evil-eye-button__effect ${effectClassName}`.trim()}
        style={{ opacity: effectOpacity }}
        aria-hidden="true"
      >
        <EvilEye {...eyeProps} />
      </span>
      <span className="evil-eye-button__shine" aria-hidden="true" />
      <span className={`evil-eye-button__label ${labelClassName}`.trim()}>{children}</span>
    </button>
  );
}

export default EvilEyeButton;
