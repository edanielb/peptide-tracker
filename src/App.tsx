export default function App() {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Peptide Index</h1>
      <p>
        A crowdsourced database of peptide experiences, dosages, and reported effects.
      </p>

      <h2>Popular Peptides</h2>
      <ul>
        <li>BPC-157</li>
        <li>TB-500</li>
        <li>Epitalon</li>
        <li>Ipamorelin</li>
        <li>CJC-1295</li>
      </ul>

      <button style={{ marginTop: "20px", padding: "10px 16px", fontSize: "16px" }}>
        Submit Experience Report
      </button>
    </div>
  )
}
