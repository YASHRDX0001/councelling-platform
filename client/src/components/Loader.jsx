import './Loader.css';

export default function Loader({ fullPage = true }) {
  if (fullPage) {
    return (
      <div className="loader-fullpage">
        <div className="loader-spinner" />
        <p>Loading...</p>
      </div>
    );
  }

  return <div className="loader-spinner" />;
}
