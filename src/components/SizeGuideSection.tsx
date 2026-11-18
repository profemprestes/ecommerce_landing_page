import { ALL_SIZES, SIZE_MEASUREMENTS_CM } from '@/data/catalog';

export function SizeGuideSection() {
  return (
    <section id="talles" className="info-section">
      <div className="container info-grid">
        <div className="info-card">
          <div className="section-kicker">Talles verificados en cm</div>
          <h2 className="section-heading">Guía de Medidas</h2>
          <p className="section-desc">
            Medimos cada prenda en plano (axila a axila y hombro a base). Las
            camisetas <strong>Versión Jugador</strong> tienen calce entallado:
            si dudás entre dos talles, elegí el mayor.
          </p>

          <div className="table-wrap">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Talle</th>
                  <th>Ancho (cm)</th>
                  <th>Largo (cm)</th>
                </tr>
              </thead>
              <tbody>
                {ALL_SIZES.map((size) => {
                  const m = SIZE_MEASUREMENTS_CM[size];
                  return (
                    <tr key={size}>
                      <td className="mono-cell">{size}</td>
                      <td className="mono-cell">{m.width} cm</td>
                      <td className="mono-cell">{m.length} cm</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div id="envios" className="info-card">
          <div className="section-kicker">Logística &amp; Pagos Uruguay</div>
          <h2 className="section-heading">Envíos a Todo el País</h2>
          <p className="section-desc">
            Stock físico en Montevideo listo para despachar en el día, sin
            esperas de importación ni preventas.
          </p>

          <ul className="shipping-list">
            <li className="shipping-item">
              <span className="shipping-tag">Montevideo</span>
              <div>
                <strong>Cadetería en el día / 24h</strong>
                <p>Coordinación directa por WhatsApp o retiro en zona centro.</p>
              </div>
            </li>
            <li className="shipping-item">
              <span className="shipping-tag">Interior</span>
              <div>
                <strong>Despacho por DAC / Agencia Central</strong>
                <p>Envíos a las 19 capitales departamentales con número de guía.</p>
              </div>
            </li>
            <li className="shipping-item">
              <span className="shipping-tag">Pagos</span>
              <div>
                <strong>Transferencia, Mercado Pago o efectivo</strong>
                <p>Precios finales en pesos uruguayos ($U) sin recargos ocultos.</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
