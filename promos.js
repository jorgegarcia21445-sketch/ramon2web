// =====================================================================
// promos.js — TEMAS DE TEMPORADA (decoración y saludo por fechas)
// =====================================================================
// El sitio cambia su decoración solo en estas fechas, cada año.
//   desde / hasta : "MM-DD" (mes-día). Pueden cruzar el año ("12-01" a "01-06").
//   tema          : navidad, patrias, muertos (ya diseñados en index.css)
//   saludo        : texto corto en una barra delgada arriba (ES / EN)
// Para ver un tema hoy: agrega ?tema=navidad a la dirección del sitio.
// Para apagar todos: "temas": []
// Aquí NO hay descuentos ni precios automáticos: los precios vienen de data/productos.csv.
// =====================================================================
window.PROMOS = {
  "temas": [
    { "tema": "navidad", "desde": "12-01", "hasta": "01-06",
      "saludo": "¡Felices fiestas! BINASA le desea una feliz Navidad y un próspero Año Nuevo",
      "saludo_en": "Season's greetings! BINASA wishes you a merry Christmas and a happy New Year" },
    { "tema": "patrias", "desde": "09-01", "hasta": "09-16",
      "saludo": "¡Viva México! Felices fiestas patrias",
      "saludo_en": "¡Viva México! Happy Mexican Independence Day" },
    { "tema": "muertos", "desde": "10-28", "hasta": "11-02",
      "saludo": "Celebramos el Día de Muertos",
      "saludo_en": "Celebrating Día de Muertos" }
  ]
};
