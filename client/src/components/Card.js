export default function Card({ title, value }) {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;600&display=swap');

        .card-wrapper {
          font-family: 'DM Sans', sans-serif;
          background: #fff;
          border: 1.5px solid #f0dada;
          border-radius: 20px;
          padding: 28px 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(230,57,70,0.09);
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: default;
        }
        .card-wrapper:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(230,57,70,0.16);
        }
        .card-wrapper::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, #b5000f, #e63946, #ff6b6b);
        }
        .card-wrapper h3 {
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #8a7070;
          margin-bottom: 12px;
        }
        .card-wrapper p {
          font-family: 'Playfair Display', serif;
          font-size: 2.6rem;
          font-weight: 900;
          color: #1a0a0a;
          line-height: 1;
        }
      `}</style>

      <div style={{ border: "1px solid black", padding: 10 }} className="card-wrapper">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
    </>
  );
}