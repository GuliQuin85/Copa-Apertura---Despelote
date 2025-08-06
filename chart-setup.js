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

  window.linea = new Chart(ctxLinea, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Puntos acumulados',
        data: values,
        fill: false,
        borderColor: '#4f46e5',
        tension: 0.1
      }]
    }
  });
}
