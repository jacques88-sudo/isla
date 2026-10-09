// Le foto della mappa: due per posto (una dove Wikimedia non ne ha di piu').
//
// Vengono tutte da Wikimedia Commons, con licenza libera (CC BY, CC BY-SA,
// CC0): si possono usare anche su un sito commerciale, a patto di scrivere
// autore e licenza — e' la riga in basso su ogni foto, col link alla pagina
// originale. Se ne sostituisci una con una foto vostra, togli l'autore o
// mettete il vostro nome: la licenza la decidete voi.
//
// La chiave e' il nome del posto in MAP_POINTS passato da mapSlug() (minuscole,
// senza accenti, trattini). Le foto stanno in assets/mappa/, 720x480.
// Scelte a mano il 7 ottobre 2026, guardandole una per una.

const MAP_PHOTOS = {
  "playa-de-las-teresitas": [
    {
      "f": "playa-de-las-teresitas-1.jpg",
      "by": "Mike Peel",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:At_Tenerife_2022_079.jpg"
    },
    {
      "f": "playa-de-las-teresitas-2.jpg",
      "by": "Mike Peel",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:At_Tenerife_2019_523.jpg"
    }
  ],
  "playa-de-benijo": [
    {
      "f": "playa-de-benijo-1.jpg",
      "by": "David Perez Perez",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_de_Benijo,_Tenerife.jpg"
    },
    {
      "f": "playa-de-benijo-2.jpg",
      "by": "Jmiguel Rodriguez",
      "lic": "CC BY 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Benijo_Beach_(140941595).jpeg"
    }
  ],
  "playa-del-bollullo": [
    {
      "f": "playa-del-bollullo-1.jpg",
      "by": "Xus Badia xusbadia",
      "lic": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_El_Bollullo,_La_Orotava,_Spain_(Unsplash).jpg"
    }
  ],
  "playa-jardin": [
    {
      "f": "playa-jardin-1.jpg",
      "by": "Kawon Kez Sel",
      "lic": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_Jard%C3%ADn_and_Castillo_de_San_Felipe,_Puerto_de_la_Cruz,_Tenerife,_December_2025.jpg"
    },
    {
      "f": "playa-jardin-2.jpg",
      "by": "Mike Peel",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Puerto_de_la_Cruz_2019_025.jpg"
    }
  ],
  "playa-de-los-guios": [
    {
      "f": "playa-de-los-guios-1.jpg",
      "by": "Mike Peel",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:At_Los_Gigantes_2022_012.jpg"
    },
    {
      "f": "playa-de-los-guios-2.jpg",
      "by": "X3m",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Los_gigantes_3.JPG"
    }
  ],
  "playa-de-la-arena": [
    {
      "f": "playa-de-la-arena-1.jpg",
      "by": "dronepicr",
      "lic": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Black_sand_beach_Playa_de_la_Arena_on_Tenerife,_Spain_(48225289937).jpg"
    },
    {
      "f": "playa-de-la-arena-2.jpg",
      "by": "Zala",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:2025_Playa_de_la_Arena_08.jpg"
    }
  ],
  "playa-del-duque": [
    {
      "f": "playa-del-duque-1.jpg",
      "by": "Marc Ryckaert",
      "lic": "CC BY 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Tenerife_Playa_El_Duque_R03.jpg"
    },
    {
      "f": "playa-del-duque-2.jpg",
      "by": "Mark",
      "lic": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_Del_Duque_-_Tenerife.jpg"
    }
  ],
  "playa-de-las-vistas": [
    {
      "f": "playa-de-las-vistas-1.jpg",
      "by": "Tuxyso",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa-Las-Vistas-Tenerife-03.jpg"
    },
    {
      "f": "playa-de-las-vistas-2.jpg",
      "by": "Tuxyso",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Sonnenuntergang-Las-Vistas-Tenerife-2024.jpg"
    }
  ],
  "el-medano": [
    {
      "f": "el-medano-1.jpg",
      "by": "Ronny Siegel",
      "lic": "CC BY 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:El_M%C3%A9dano_-_Tenerife_11.jpg"
    },
    {
      "f": "el-medano-2.jpg",
      "by": "Ronny Siegel",
      "lic": "CC BY 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:El_M%C3%A9dano_-_Tenerife_03.jpg"
    }
  ],
  "playa-de-la-tejita": [
    {
      "f": "playa-de-la-tejita-1.jpg",
      "by": "Karmelo26",
      "lic": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_nudista_La_Tejita._Tenerife_(72399).jpg"
    },
    {
      "f": "playa-de-la-tejita-2.jpg",
      "by": "Karmelo26",
      "lic": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_nudista_La_Tejita._Tenerife.jpg"
    }
  ],
  "mirador-roques-de-garcia": [
    {
      "f": "mirador-roques-de-garcia-1.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Caldera_de_las_Ca%C3%B1adas_07.jpg"
    },
    {
      "f": "mirador-roques-de-garcia-2.jpg",
      "by": "Ad Meskens",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Tenerife_Teide_National_Park_09.jpg"
    }
  ],
  "mirador-de-chipeque": [
    {
      "f": "mirador-de-chipeque-1.jpg",
      "by": "Flocci Nivis",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:20250704_Mirador_de_Chipeque_02.jpg"
    },
    {
      "f": "mirador-de-chipeque-2.jpg",
      "by": "Flocci Nivis",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:20250704_Mirador_de_Chipeque_01.jpg"
    }
  ],
  "mirador-cruz-del-carmen": [
    {
      "f": "mirador-cruz-del-carmen-1.jpg",
      "by": "Falk2",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:J00_700_mirador_Cruz_de_Carmen.jpg"
    },
    {
      "f": "mirador-cruz-del-carmen-2.jpg",
      "by": "Mentxuwiki",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Cruz_del_Carmen_2.jpg"
    }
  ],
  "mirador-pico-del-ingles": [
    {
      "f": "mirador-pico-del-ingles-1.jpg",
      "by": "Mentxuwiki",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Mirador_Pico_del_Ingl%C3%A9s,_Parque_Rural_de_Anaga_(Tenerife).jpg"
    },
    {
      "f": "mirador-pico-del-ingles-2.jpg",
      "by": "Mentxuwiki",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Mirador_Pico_del_Ingl%C3%A9s,_Parque_Rural_de_Anaga_(Tenerife)_6.jpg"
    }
  ],
  "mirador-de-archipenque": [
    {
      "f": "mirador-de-archipenque-1.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Los_Gigantes,_Tenerife,_Espa%C3%B1a,_2012-12-16,_DD_10.jpg"
    },
    {
      "f": "mirador-de-archipenque-2.jpg",
      "by": "-wuppertaler",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:ESP_Tenerife,_Santiago_del_Teide,_Los_Gigantes,_Mirador_Archipenque_0008.jpg"
    }
  ],
  "mirador-de-cherfe": [
    {
      "f": "mirador-de-cherfe-1.jpg",
      "by": "Falk2",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:J00_750_Lomo_de_Guergues.jpg"
    },
    {
      "f": "mirador-de-cherfe-2.jpg",
      "by": "Falk2",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:J00_753_Masca.jpg"
    }
  ],
  "mirador-de-humboldt": [
    {
      "f": "mirador-de-humboldt-1.jpg",
      "by": "Mike Peel",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:At_Mirador_de_Humboldt_2023_008.jpg"
    },
    {
      "f": "mirador-de-humboldt-2.jpg",
      "by": "Quartl",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Valle_de_La_Orotava_qtl1.jpg"
    }
  ],
  "mirador-de-la-garanona": [
    {
      "f": "mirador-de-la-garanona-1.jpg",
      "by": "jfreire",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Desde_el_mirador_de_La_Garano%C3%B1a_-_panoramio.jpg"
    }
  ],
  "mirador-de-ortuno": [
    {
      "f": "mirador-de-ortuno-1.jpg",
      "by": "Falk2",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:J00_574_Pico_de_Teide.jpg"
    },
    {
      "f": "mirador-de-ortuno-2.jpg",
      "by": "Falk2",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Tf3.01_Cumbre_Dorsal,_Teide.jpg"
    }
  ],
  "mirador-de-la-centinela": [
    {
      "f": "mirador-de-la-centinela-1.jpg",
      "by": "javiersanp",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:La_Centinela,_Jama,_Monta%C3%B1a_de_las_Tabaibas,_Monta%C3%B1a_Cambada._-_panoramio.jpg"
    }
  ],
  "paisaje-lunar": [
    {
      "f": "paisaje-lunar-1.jpg",
      "by": "Chmee2",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Paisaje_Lunar_de_Granadilla_on_Tenerife_in_2014_(7).JPG"
    },
    {
      "f": "paisaje-lunar-2.jpg",
      "by": "Chmee2",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Paisaje_Lunar_de_Granadilla_on_Tenerife_in_2014_(8).JPG"
    }
  ],
  "sanatorio-de-abades": [
    {
      "f": "sanatorio-de-abades-1.jpg",
      "by": "Flocci Nivis",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:20250703_Sanatorio_de_Abona_28.jpg"
    },
    {
      "f": "sanatorio-de-abades-2.jpg",
      "by": "Flocci Nivis",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:20250703_Sanatorio_de_Abona_22.jpg"
    }
  ],
  "el-pijaral": [
    {
      "f": "el-pijaral-1.jpg",
      "by": "Tanja Freibott",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:DSC08872_El_Pijaral_(Anaga,_Tenerife,_Canarias).jpg"
    },
    {
      "f": "el-pijaral-2.jpg",
      "by": "Tanja Freibott",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:DSC08930_El_Pijaral_(Anaga,_Tenerife,_Canarias).jpg"
    }
  ],
  "chinamada": [
    {
      "f": "chinamada-1.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Chinamada_-_Tenerife_03.jpg"
    },
    {
      "f": "chinamada-2.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Chinamada_-_Tenerife_02.jpg"
    }
  ],
  "playa-del-roque-de-las-bodegas": [
    {
      "f": "playa-del-roque-de-las-bodegas-1.jpg",
      "by": "Winahwaru",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_del_Roque_(Taganana).JPG"
    },
    {
      "f": "playa-del-roque-de-las-bodegas-2.jpg",
      "by": "Cecilio Arbelo",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Ensenada_roque_de_las_bodegas.jpg"
    }
  ],
  "charco-de-la-laja": [
    {
      "f": "charco-de-la-laja-1.jpg",
      "by": "Loi Ribera",
      "lic": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:San_Juan_De_La_Rambla_(195680373).jpeg"
    }
  ],
  "charco-del-viento": [
    {
      "f": "charco-del-viento-1.jpg",
      "by": "Dieglop",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Charco_del_viento_01.jpg"
    }
  ],
  "punta-de-teno": [
    {
      "f": "punta-de-teno-1.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Punta_de_Teno_02.jpg"
    },
    {
      "f": "punta-de-teno-2.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Faro_de_Teno_-_Tenerife_02.jpg"
    }
  ],
  "cueva-del-viento": [
    {
      "f": "cueva-del-viento-1.jpg",
      "by": "Evdpnl",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Cueva_del_Viento_Icod_de_los_Vinos.jpg"
    },
    {
      "f": "cueva-del-viento-2.jpg",
      "by": "Mike Peel",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:At_Cueva_del_Viento_2023_023.jpg"
    }
  ],
  "montana-amarilla": [
    {
      "f": "montana-amarilla-1.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Monta%C3%B1a_Amarilla,_Arona,_Tenerife,_Espa%C3%B1a,_2022-01-06,_DD_08-10_HDR.jpg"
    },
    {
      "f": "montana-amarilla-2.jpg",
      "by": "Mataparda",
      "lic": "CC BY-SA 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Monta%C3%B1a_Amarilla.jpg"
    }
  ],
  "teleferico-del-teide": [
    {
      "f": "teleferico-del-teide-1.jpg",
      "by": "Ingo Mehling",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Teide_Cable_Car_Carriage.jpg"
    },
    {
      "f": "teleferico-del-teide-2.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Tel%C3%A9ferico_del_Teide_01.jpg"
    }
  ],
  "masca": [
    {
      "f": "masca-1.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Masca_-_Macizo_de_Teno_02.jpg"
    },
    {
      "f": "masca-2.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Masca_-_Macizo_de_Teno_03.jpg"
    }
  ],
  "drago-milenario": [
    {
      "f": "drago-milenario-1.jpg",
      "by": "Lmbuga",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Drago_(Dracaena_drago)_Milenario_de_Icod_de_los_Vinos._Tenerife._Illas_Canarias_eue-09.jpg"
    },
    {
      "f": "drago-milenario-2.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Drago_milenario,_Icod_de_los_Vinos,_Tenerife,_Espa%C3%B1a,_2012-12-13,_DD_10.jpg"
    }
  ],
  "garachico": [
    {
      "f": "garachico-1.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Vista_de_Garachico,_Tenerife,_Espa%C3%B1a,_2012-12-13,_DD_05.jpg"
    },
    {
      "f": "garachico-2.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Vista_de_Garachico,_Tenerife,_Espa%C3%B1a,_2012-12-13,_DD_04.jpg"
    }
  ],
  "san-cristobal-de-la-laguna": [
    {
      "f": "san-cristobal-de-la-laguna-1.jpg",
      "by": "Thomas Wolf, www.foto-tw.de",
      "lic": "CC BY-SA 3.0 de",
      "url": "https://commons.wikimedia.org/wiki/File:San_Crist%C3%B3bal_de_La_Laguna.jpg"
    },
    {
      "f": "san-cristobal-de-la-laguna-2.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Parroquia_de_la_Concepci%C3%B3n,_San_Crist%C3%B3bal_de_La_Laguna,_Tenerife,_Espa%C3%B1a,_2022-01-07,_DD,_DD_108-110_HDR.jpg"
    }
  ],
  "la-orotava": [
    {
      "f": "la-orotava-1.jpg",
      "by": "Cayambe",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Tenerife,_Valle_de_la_Orotava_from_El_Lance_2023a.jpg"
    },
    {
      "f": "la-orotava-2.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Bel%C3%A9n_en_la_plaza_del_Ayuntamiento,_La_Orotava,_Tenerife,_Espa%C3%B1a,_2012-12-13,_DD_01.jpg"
    }
  ],
  "piramides-de-guimar": [
    {
      "f": "piramides-de-guimar-1.jpg",
      "by": "Axel Cotón Gutiérrez",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Pir%C3%A1mides_de_G%C3%BC%C3%ADmar_05.jpg"
    },
    {
      "f": "piramides-de-guimar-2.jpg",
      "by": "Axel Cotón Gutiérrez",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Pir%C3%A1mides_de_G%C3%BC%C3%ADmar_02.jpg"
    }
  ],
  "loro-parque": [
    {
      "f": "loro-parque-1.jpg",
      "by": "H. Zell",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Aratinga_solstitialis_-_Loro_Parque_01.jpg"
    },
    {
      "f": "loro-parque-2.jpg",
      "by": "AnatolyPm",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:King_penguins_at_Loro_Parque_2.jpg"
    }
  ],
  "siam-park": [
    {
      "f": "siam-park-1.jpg",
      "by": "stephen jones",
      "lic": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Siam_Park_(46).jpg"
    },
    {
      "f": "siam-park-2.jpg",
      "by": "Wouter Hagens",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:A0455_Tenerife,_Siam_Park_aerial_view.jpg"
    }
  ],
  "auditorio-de-tenerife": [
    {
      "f": "auditorio-de-tenerife-1.jpg",
      "by": "Wladyslaw, derivative work: Nikopol",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Auditorio_de_Tenerife_Pano_edit.jpg"
    },
    {
      "f": "auditorio-de-tenerife-2.jpg",
      "by": "Diego Delso",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Auditorio_de_Tenerife,_Santa_Cruz_de_Tenerife,_Espa%C3%B1a,_2012-12-15,_DD_17.jpg"
    }
  ],
  "playa-de-abama": [
    {
      "f": "playa-de-abama-1.jpg",
      "by": "-wuppertaler",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:ESP_Tenerife,_Gu%C3%ADa_de_Isora,_Abama,_Playa_Abama_0006.jpg"
    },
    {
      "f": "playa-de-abama-2.jpg",
      "by": "-wuppertaler",
      "lic": "CC BY 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:ESP_Tenerife,_Gu%C3%ADa_de_Isora,_Abama,_Playa_Abama_0007.jpg"
    }
  ],
  "playa-de-la-jaquita": [
    {
      "f": "playa-de-la-jaquita-1.jpg",
      "by": "dronepicr",
      "lic": "CC BY 2.0",
      "url": "https://commons.wikimedia.org/wiki/File:Strand_Playa_la_Jaquita_in_Alcala_auf_Teneriffa,_Spanien_(48225512512).jpg"
    }
  ],
  "playa-de-almaciga": [
    {
      "f": "playa-de-almaciga-1.jpg",
      "by": "Mentxuwiki",
      "lic": "CC0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_de_Alm%C3%A1ciga,_Santa_Cruz_de_Tenerife.jpg"
    },
    {
      "f": "playa-de-almaciga-2.jpg",
      "by": "Discasto",
      "lic": "CC BY-SA 4.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_de_Alm%C3%A1ciga_(9_de_agosto_de_2011,_Anaga).JPG"
    }
  ],
  "playa-de-el-socorro": [
    {
      "f": "playa-de-el-socorro-1.jpg",
      "by": "Javier1989canario",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_de_El_Socorro.JPG"
    },
    {
      "f": "playa-de-el-socorro-2.jpg",
      "by": "Javier1989canario",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Atardecer_Playa_El_Socorro.JPG"
    }
  ],
  "playa-de-masca": [
    {
      "f": "playa-de-masca-1.jpg",
      "by": "javiersanp",
      "lic": "CC BY-SA 3.0",
      "url": "https://commons.wikimedia.org/wiki/File:Playa_de_Masca_desde_La_Fortaleza_-_panoramio.jpg"
    }
  ]
};
