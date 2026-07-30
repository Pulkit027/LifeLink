const spinnerStyles = `
  .spinner-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(253, 246, 245, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .spinner-inline {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    width: 100%;
  }

  .spinner-circle {
    width: 40px;
    height: 40px;
    border: 3.5px solid rgba(201, 40, 45, 0.15);
    border-top-color: #c9282d;
    border-radius: 50%;
    animation: spinner-spin 0.8s linear infinite;
  }

  .spinner-small {
    width: 24px;
    height: 24px;
    border-width: 2.5px;
  }

  @keyframes spinner-spin {
    to { transform: rotate(360deg); }
  }
`;

export default function LoadingSpinner({ fullScreen = false, small = false }) {
  return (
    <>
      <style>{spinnerStyles}</style>
      <div className={fullScreen ? "spinner-overlay" : "spinner-inline"}>
        <div className={`spinner-circle ${small ? "spinner-small" : ""}`} />
      </div>
    </>
  );
}
