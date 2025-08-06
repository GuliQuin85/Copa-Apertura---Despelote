const datos = {
  "Pretemporada Julio": {
    resultados: [
      { fecha: "15/07", primero: "Michi", segundo: "Guli", tercero: "Anton" },
      { fecha: "16/07", primero: "Lipo", segundo: "Vero", tercero: "Rodri" },
      { fecha: "17/07", primero: "Fede", segundo: "Michi", tercero: "Agus" }
    ]
  },
  "Copa Apertura Agosto": {
    resultados: []
  }
};

function calcularPuntos(resultados) {
  const puntos = {};
  resultados.forEach(r => {
    puntos[r.primero] = (puntos[r.primero] || 0) + 3;
    puntos[r.segundo] = (puntos[r.segundo] || 0) + 2;
    puntos[r.tercero] = (puntos[r.tercero] || 0) + 1;
  });
  return puntos;
}

function renderCopa(nombre) {
  const copa = datos[nombre];
  const ranking = calcularPuntos(copa.resultados);
  const rankingHTML = Object.entries(ranking)
    .sort((a,b) => b[1]-a[1])
    .map(([nombre, pts], i) => `<tr><td>${i+1}</td><td>${nombre}</td><td>${pts}</td></tr>`)
    .join("");
  document.getElementById("ranking").innerHTML = `
    <h2>Ranking</h2>
    <table><tr><th>#</th><th>Nombre</th><th>Puntos</th></tr>${rankingHTML}</table>
  `;
  const resultadosHTML = copa.resultados.map(r => 
    `<tr><td>${r.fecha}</td><td>${r.primero}</td><td>${r.segundo}</td><td>${r.tercero}</td></tr>`
  ).join("");
  document.getElementById("resultados").innerHTML = `
    <h2>Resultados por día</h2>
    <table><tr><th>Fecha</th><th>1º</th><th>2º</th><th>3º</th></tr>${resultadosHTML}</table>
  `;
  renderGraficos(ranking);
}

document.getElementById("copaSelector").innerHTML = Object.keys(datos)
  .map(nombre => `<option value="${nombre}">${nombre}</option>`).join("");

document.getElementById("copaSelector").addEventListener("change", e => {
  renderCopa(e.target.value);
});

renderCopa("Pretemporada Julio");
