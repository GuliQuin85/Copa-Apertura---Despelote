function renderGraficos(puntos) {
  const ctxTorta = document.getElementById('graficoTorta').getContext('2d');
  const ctxLinea = document.getElementById('graficoLinea').getContext('2d');
  if (window.torta) window.torta.destroy();
  if (window.linea) window.linea.destroy();

  const labels = Object.keys(puntos);
  const values = Object.values(puntos);

  window.torta = new Chart(ctxTorta, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        label: 'Puntos',
        data: values,
        backgroundColor: ['#f87171','#60a5fa','#34d399','#facc15','#c084fc']
      }]
    }
  });
  
  const { posiciones, fechas } = calcularPosicionesDiarias(copa.resultados);
  const jugadores = Object.keys(posiciones);
  renderSelectorDeJugadores(jugadores, posiciones, fechas);
  
  function renderTrazabilidad(jugadores, posiciones, fechas) {
  const ctx = document.getElementById("graficoTrazabilidad").getContext("2d");
  if (window.trazabilidadChart) window.trazabilidadChart.destroy();

  const datasets = jugadores.map((j, i) => ({
    label: j,
    data: posiciones[j],
    fill: false,
    tension: 0.3,
    borderColor: `hsl(${(i * 72) % 360}, 70%, 50%)`,
    borderWidth: 2
  }));

  window.trazabilidadChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: fechas,
      datasets
    },
    options: {
      responsive: true,
      scales: {
        y: {
          reverse: true,
          title: {
            display: true,
            text: 'Posición (1 = mejor)'
          },
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          position: 'top'
        }
      }
    }
  });
}

}
