const datos = {
  "Pretemporada Julio": {
    resultados: [
      { fecha: "15/07", primero: "Michi", segundo: "Agus", tercero: "Guli" },
      { fecha: "16/07", primero: "Nahuel", segundo: "Guli", tercero: "Sandra" },
      { fecha: "17/07", primero: "Nahuel", segundo: "Rodri", tercero: "Guli" },
      { fecha: "18/07", primero: "Vero", segundo: "Sandra", tercero: "Guli" },
      { fecha: "21/07", primero: "Guli", segundo: "Rodri", tercero: "Lucia" },
      { fecha: "22/07", primero: "Nahuel", segundo: "Michi", tercero: "Agus" },
      { fecha: "23/07", primero: "Vero", segundo: "Rodri", tercero: "Lucia" },
      { fecha: "24/07", primero: "Nahuel", segundo: "Fede", tercero: "Vero" },
      { fecha: "25/07", primero: "Michi", segundo: "Anton", tercero: "Moni" },
      { fecha: "28/07", primero: "Anton", segundo: "Vero", tercero: "Moni" },
      { fecha: "29/07", primero: "Fede", segundo: "Rodri", tercero: "Alita" },
      { fecha: "30/07", primero: "Michi", segundo: "Rodri", tercero: "Moni" },
      { fecha: "31/07", primero: "Moni", segundo: "Alita", tercero: "Fede" },
      { fecha: "01/08", primero: "Michi", segundo: "Guli", tercero: "Anton" }
    ]
  },
  "Copa Apertura Agosto": {
    resultados: [
      { fecha: "04/08", primero: "Anton", segundo: "Vero", tercero: "Michi" },
      { fecha: "05/08", primero: "Guli", segundo: "Anton", tercero: "Agus" },
      { fecha: "06/08", primero: "Michi", segundo: "Guli", tercero: "Anton" },
      { fecha: "07/08", primero: "Vero", segundo: "MatiQ", tercero: "Guli" }
    ]
  }
};

function calcularRankingConDesempate(copaActual, nombreCopaAnterior = null) {
  const puntos = {};
  const podios = {};
  const jugadores = new Set();
  const resultados = copaActual.resultados;

  resultados.forEach(r => {
    [r.primero, r.segundo, r.tercero].forEach(j => jugadores.add(j));

    puntos[r.primero] = (puntos[r.primero] || 0) + 3;
    puntos[r.segundo] = (puntos[r.segundo] || 0) + 2;
    puntos[r.tercero] = (puntos[r.tercero] || 0) + 1;

    podios[r.primero] = podios[r.primero] || { oro: 0, plata: 0, bronce: 0 };
    podios[r.segundo] = podios[r.segundo] || { oro: 0, plata: 0, bronce: 0 };
    podios[r.tercero] = podios[r.tercero] || { oro: 0, plata: 0, bronce: 0 };

    podios[r.primero].oro++;
    podios[r.segundo].plata++;
    podios[r.tercero].bronce++;
  });

  // Pre-ranking anterior para desempate final
  const posicionesAnteriores = {};
  if (nombreCopaAnterior && datos[nombreCopaAnterior]) {
    const prev = calcularRankingConDesempate(datos[nombreCopaAnterior]);
    prev.forEach((jugador, index) => {
      posicionesAnteriores[jugador.nombre] = index + 1;
    });
  }

  const ranking = Array.from(jugadores).map(nombre => ({
    nombre,
    puntos: puntos[nombre] || 0,
    oro: podios[nombre]?.oro || 0,
    plata: podios[nombre]?.plata || 0,
    bronce: podios[nombre]?.bronce || 0,
    rankingAnterior: posicionesAnteriores[nombre] || 99
  }));

  // Orden con múltiples niveles
  ranking.sort((a, b) => {
    if (b.puntos !== a.puntos) return b.puntos - a.puntos;
    if (b.oro !== a.oro) return b.oro - a.oro;
    if (b.plata !== a.plata) return b.plata - a.plata;
    if (b.bronce !== a.bronce) return b.bronce - a.bronce;
    return a.rankingAnterior - b.rankingAnterior;
  });

  return ranking;
}

function renderCopa(nombre) {
  const copa = datos[nombre];
  const nombreAnterior = nombre === "Copa Apertura Agosto" ? "Pretemporada Julio" : null;
  const ranking = calcularRankingConDesempate(copa, nombreAnterior);
const rankingHTML = ranking.map((jugador, i) => {
  const avatar = `<span class="avatar">${jugador.nombre[0]}</span>`;
  return `<tr><td>${i + 1}</td><td>${avatar}${jugador.nombre}</td><td>${jugador.puntos}</td></tr>`;
}).join("");

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
  const { posiciones, fechas } = calcularRankingPorDia(copa.resultados);
  const jugadores = Object.keys(posiciones);
  renderSelectorDeJugadores(jugadores, posiciones, fechas);
}

document.getElementById("copaSelector").innerHTML = Object.keys(datos)
  .map(nombre => `<option value="${nombre}">${nombre}</option>`).join("");

document.getElementById("copaSelector").addEventListener("change", e => {
  renderCopa(e.target.value);
});

renderCopa("Pretemporada Julio");

function calcularRankingPorDia(resultados) {
  const fechas = resultados.map(r => r.fecha);
  const puntosAcumulados = [];
  const posicionesPorJugador = {};

  resultados.forEach((_, i) => {
    const parciales = resultados.slice(0, i + 1);
    const puntos = calcularPuntos(parciales);

    const rankingOrdenado = Object.entries(puntos)
      .sort((a, b) => b[1] - a[1])
      .map(([nombre]) => nombre);

    rankingOrdenado.forEach((jugador, pos) => {
      if (!posicionesPorJugador[jugador]) {
        posicionesPorJugador[jugador] = [];
      }
      posicionesPorJugador[jugador][i] = pos + 1;
    });

    // Jugadores que aún no existían en este punto
    Object.keys(posicionesPorJugador).forEach(j => {
      if (posicionesPorJugador[j].length < i + 1) {
        posicionesPorJugador[j][i] = rankingOrdenado.length + 1;
      }
    });
  });

  return { posiciones: posicionesPorJugador, fechas };
}

function renderSelectorDeJugadores(jugadores, posiciones, fechas) {
  const contenedor = document.getElementById("jugadoresSelector");
  contenedor.innerHTML = "";
  const seleccionados = new Set();

  jugadores.forEach(j => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = j;
    checkbox.id = `chk-${j}`;
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        seleccionados.add(j);
      } else {
        seleccionados.delete(j);
      }
      if (seleccionados.size <= 5) {
        renderTrazabilidad([...seleccionados], posiciones, fechas);
      } else {
        checkbox.checked = false;
        seleccionados.delete(j);
        alert("Máximo 5 jugadores a la vez.");
      }
    });

    const label = document.createElement("label");
    label.htmlFor = `chk-${j}`;
    label.innerText = j;

    contenedor.appendChild(checkbox);
    contenedor.appendChild(label);
    contenedor.appendChild(document.createTextNode(" "));
  });
}

