import fs from 'fs';
import path from 'path';

const articles = [
  // SYMPTÔMES
  {
    col: 'symptomes', slug: 'voiture-ne-demarre-pas-par-ou-commencer', 
    title: "Voiture ne démarre pas : par où commencer ?", 
    desc: "Méthodologie globale pour aborder un véhicule en panne : batterie, IMMO, démarreur, carburant, allumage.",
    sys: "moteur", diff: "debutant", tools: '["scanner", "multimetre"]',
    body: "## 1. La Batterie\nToujours vérifier la tension au repos (> 12.2V) et la chute au démarrage (> 9.5V).\n\n## 2. L'Antidémarrage\nLe voyant IMMO s'éteint-il avec le contact ?\n\n## 3. Le Démarreur\nLe moteur est-il entraîné ? Si oui (Crank), le problème est l'air, le carburant, ou l'étincelle.\nSi non (No-Crank), testez le relais et le solénoïde du démarreur."
  },
  {
    col: 'symptomes', slug: 'moteur-demarre-puis-cale-immediatement', 
    title: "Le moteur démarre puis cale immédiatement", 
    desc: "Diagnostic d'un moteur qui s'étouffe après le démarrage : IMMO, prise d'air, EGR bloquée ouverte.",
    sys: "moteur", diff: "intermediaire", tools: '["scanner"]',
    body: "## Causes Fréquentes\n1. **Antidémarrage** : Démarre 2 secondes puis se coupe (typique VAG).\n2. **Prise d'air massive** : Durite déboîtée après le MAF.\n3. **EGR bloquée ouverte** : Les gaz d'échappement étouffent le moteur au ralenti.\n\n## Tests\n- Débranchez le débitmètre (MAF). Si le moteur tient le ralenti sur sa cartographie de secours (Alpha-N), cherchez une prise d'air ou un MAF HS."
  },
  {
    col: 'symptomes', slug: 'ralenti-instable-diagnostic', 
    title: "Ralenti instable : méthode de diagnostic complète", 
    desc: "Comment isoler la cause d'un ralenti qui oscille (pompage) : Fuel trims, papillon, sondes, actuateur de ralenti.",
    sys: "moteur", diff: "intermediaire", tools: '["scanner", "machine_a_fumee"]',
    body: "## Le Diagnostic par les Fuel Trims\nSi le LTFT est très positif au ralenti : prise d'air.\n## Inspection du Papillon\nUn boîtier papillon encrassé (Throttle Body) empêche la régulation fine de l'air. Nettoyez-le et réinitialisez les apprentissages (Throttle Adaptation)."
  },
  {
    col: 'symptomes', slug: 'perte-de-puissance-acceleration', 
    title: "Perte de puissance à l'accélération : hypothèses et tests", 
    desc: "Diagnostic d'un moteur qui s'effondre en charge : débitmètre, pression carburant, géométrie turbo, catalyseur bouché.",
    sys: "moteur", diff: "intermediaire", tools: '["scanner"]',
    body: "## Pression Turbo (Diesel / Essence Turbo)\nVérifiez la Consigne vs Réel en pleine charge.\n## Contre-pression Échappement\nUn catalyseur ou FAP bouché empêche le moteur de respirer. Retirez la sonde lambda amont et faites un essai routier (bruyant) pour voir si la puissance revient."
  },
  {
    col: 'symptomes', slug: 'moteur-broute-a-chaud', 
    title: "Moteur qui broute à chaud", 
    desc: "Problèmes liés à la température : bobines d'allumage défaillantes, capteur PMH qui coupe, sonde lambda paresseuse.",
    sys: "moteur", diff: "intermediaire", tools: '["scanner", "oscilloscope"]',
    body: "## La Dilatation Thermique\nCertains composants (capteurs PMH inductifs, bobines) se coupent intérieurement lorsque la température monte.\n## Tests\nLisez les ratés de combustion (Misfires) en direct. Chauffez la bobine suspecte au décapeur thermique (doucement) pour recréer la panne."
  },
  {
    col: 'symptomes', slug: 'moteur-broute-a-froid', 
    title: "Moteur qui broute à froid uniquement", 
    desc: "Diagnostic d'un moteur instable à froid : bougies de préchauffage, capteur ECT, joints de collecteur d'admission.",
    sys: "moteur", diff: "intermediaire", tools: '["scanner"]',
    body: "## Joints Collecteur Admission (Essence)\nLe caoutchouc durcit avec le temps. À froid, ils fuient (prise d'air). En chauffant, ils se dilatent et scellent la fuite. Le LTFT sera élevé à froid.\n## Préchauffage (Diesel)\nVérifiez la résistance des bougies de préchauffage et l'alimentation du boîtier."
  },
  {
    col: 'symptomes', slug: 'demarrage-difficile-a-froid', 
    title: "Démarrage difficile à froid : diagnostic pas à pas", 
    desc: "Capteur de température liquide de refroidissement (ECT) défectueux, désamorçage circuit carburant, préchauffage.",
    sys: "moteur", diff: "debutant", tools: '["scanner", "multimetre"]',
    body: "## L'illusion thermique\nRegardez la température ECT au scanner après une nuit froide. Si le scanner indique 80°C alors qu'il fait 5°C dehors, l'ECU ne mettra pas le 'starter' (enrichissement). Remplacez la sonde ECT."
  },
  {
    col: 'symptomes', slug: 'demarrage-difficile-a-chaud', 
    title: "Démarrage difficile à chaud : diagnostic pas à pas", 
    desc: "Vapor lock, capteur AAC/PMH, injecteurs qui fuient, perte de pression résiduelle.",
    sys: "moteur", diff: "intermediaire", tools: '["scanner", "multimetre"]',
    body: "## Perte de pression résiduelle\nSi l'injecteur fuit goutte à goutte moteur arrêté, la rampe se vide et le cylindre se noie. Au démarrage à chaud, le moteur est 'noyé'. Vérifiez le maintien de pression avec un manomètre."
  },
  {
    col: 'symptomes', slug: 'consommation-anormale-carburant', 
    title: "Consommation de carburant anormalement élevée", 
    desc: "Thermostat bloqué ouvert, sonde lambda bloquée riche, capteur MAF défectueux, freins grippés.",
    sys: "moteur", diff: "debutant", tools: '["scanner"]',
    body: "## Le Thermostat (Calorstat)\nSi le moteur ne dépasse jamais 70°C, l'ECU reste en boucle d'enrichissement (Warm-up). Lisez la température ECT en roulant sur voie rapide.\n## Sonde Lambda Amont\nUne sonde fatiguée lit souvent 'pauvre' et force l'ECU à injecter trop d'essence."
  },
  {
    col: 'symptomes', slug: 'voyant-moteur-sans-perte-performance', 
    title: "Voyant moteur allumé sans perte de performance apparente", 
    desc: "Système EVAP (recyclage vapeurs), sonde lambda aval (catalyseur), bougies de préchauffage (sur certains diesels).",
    sys: "moteur", diff: "debutant", tools: '["scanner"]',
    body: "## Défauts d'Émissions\nLes pannes d'EVAP (micro-fuite) ou de rendement du catalyseur (P0420) n'affectent pas la conduite, mais allument le voyant MIL par obligation légale."
  },
  {
    col: 'symptomes', slug: 'voyant-abs-allume-que-verifier', 
    title: "Voyant ABS allumé : que vérifier avant de scanner ?", 
    desc: "Inspection visuelle des capteurs de roues, cibles magnétiques, niveau de liquide de frein et fusibles de pompe.",
    sys: "abs", diff: "debutant", tools: '["multimetre"]',
    body: "## Inspection Physique\n1. Fil de capteur arraché dans le passage de roue.\n2. Cible ABS (bague magnétique ou crantée) fendue, rouillée ou encrassée.\n3. Fusible 40A de la pompe ABS grillé."
  },
  {
    col: 'symptomes', slug: 'defaut-esp-intermittent', 
    title: "Défaut ESP intermittent : méthode de confirmation", 
    desc: "Capteur d'angle de braquage (SAS), capteur de lacet, ou simple chute de tension batterie.",
    sys: "abs", diff: "intermediaire", tools: '["scanner"]',
    body: "## Le Capteur d'Angle de Braquage\nEn Live Data, tournez le volant de butée en butée. L'angle doit passer de -360° à +360° de manière fluide. Un 'saut' à 0° au milieu indique une piste usée."
  },
  {
    col: 'symptomes', slug: 'plusieurs-voyants-allumes', 
    title: "Plusieurs voyants allumés simultanément : par où commencer ?", 
    desc: "Batterie faible, défaut de masse châssis, ou module réseau (Gateway/BCM) planté.",
    sys: "can", diff: "debutant", tools: '["multimetre"]',
    body: "## Règle de l'Alimentation\nUn alternateur qui charge à 11.5V (sous-tension) ou 16V (surtension) fera planter tous les calculateurs simultanément. Mesurez toujours la tension de la batterie moteur tournant d'abord."
  },
  {
    col: 'symptomes', slug: 'batterie-decharge-nuit-parasite', 
    title: "Batterie qui se décharge la nuit : diagnostic de consommation parasite", 
    desc: "Comment utiliser un multimètre en série ou une pince ampèremétrique pour trouver le calculateur qui ne s'endort pas.",
    sys: "bcm", diff: "avance", tools: '["multimetre", "pince_amperemetrique"]',
    body: "## Chute de Tension sur Fusible\nAu lieu de débrancher les fusibles un par un (ce qui réveille les calculateurs), mesurez les millivolts (mV) *aux bornes* de chaque fusible. Un fusible traversé par un courant affichera une micro-chute de tension."
  },
  {
    col: 'symptomes', slug: 'ecu-inaccessible-diagnostic', 
    title: "ECU inaccessible au diagnostic : les causes à éliminer", 
    desc: "Tension OBD, masses ECU, fusibles d'alimentation principale, relais de gestion moteur, lignes CAN.",
    sys: "ecu", diff: "avance", tools: '["multimetre"]',
    body: "## Schéma Électrique Obligatoire\nTrouvez le pinout de l'ECU. Vérifiez le +12V permanent, le +12V après contact (Ignition), et les Masses. Si tout est présent, vérifiez les lignes CAN H et CAN L à l'oscilloscope."
  },
  {
    col: 'symptomes', slug: 'defaut-communication-can-sans-symptome', 
    title: "Défaut de communication CAN sans symptôme visible", 
    desc: "Pourquoi des codes U0xxx apparaissent de manière furtive : micro-coupures, réveils asynchrones des calculateurs.",
    sys: "can", diff: "intermediaire", tools: '["scanner"]',
    body: "## Les U-Codes fantômes\nTrès fréquents si la batterie est un peu faible au démarrage. L'ECU moteur démarre plus vite que le module ABS, générant un défaut furtif 'Perte de com avec ABS'. Effacez-les et vérifiez la batterie."
  },
  {
    col: 'symptomes', slug: 'panne-intermittente-pieger', 
    title: "Panne intermittente : comment la piéger", 
    desc: "Utilisation du mode enregistrement du scanner, de l'oscilloscope avec trigger, et du wiggle test (test de secousse).",
    sys: "moteur", diff: "avance", tools: '["oscilloscope"]',
    body: "## Wiggle Test (Test de Secousse)\nMoteur au ralenti, secouez méthodiquement le faisceau électrique, les connecteurs d'injecteurs et de capteurs. Si le moteur cale ou broute, vous avez trouvé la zone du faux contact."
  },

  // CAS REELS (Excluding the 4 I already made properly: clio, golf, kia, nissan)
  {
    col: 'casreels', slug: 'dacia-sandero-demarrage-impossible-batterie',
    title: "Dacia Sandero — démarrage impossible malgré une batterie neuve",
    desc: "Le démarreur clique mais ne tourne pas. Batterie neuve. Diagnostic de la tresse de masse moteur.",
    sys: "moteur", diff: "debutant", tools: '["multimetre"]',
    body: "## Test de Chute de Tension\nPointe rouge sur le (-) batterie. Pointe noire sur le bloc moteur en métal. Actionnez le démarreur. Si la lecture est de 8 Volts, la tresse de masse reliant le châssis au moteur est oxydée ou coupée."
  },
  {
    col: 'casreels', slug: 'bmw-serie-3-u-code-batterie',
    title: "BMW Série 3 — U-code après remplacement de batterie",
    desc: "Pourquoi il faut enregistrer une batterie neuve sur les véhicules modernes (IBS) sous peine de défauts électriques.",
    sys: "bcm", diff: "intermediaire", tools: '["scanner"]',
    body: "## L'IBS (Intelligent Battery Sensor)\nLe calculateur gère la charge en fonction du vieillissement de la batterie. Si on met une batterie neuve sans l'enregistrer, l'alternateur la surcharge (15V), causant des U-codes et des coupures d'infodivertissement."
  },
  {
    col: 'casreels', slug: 'citroen-c3-ralenti-instable-batterie',
    title: "Citroën C3 — ralenti instable après un débranchement de batterie",
    desc: "Perte des apprentissages du boîtier papillon motorisé suite à une coupure de courant.",
    sys: "moteur", diff: "debutant", tools: '["scanner"]',
    body: "## Réapprentissage\nLe papillon est encrassé, l'ECU avait 'appris' à l'ouvrir un peu plus. La coupure batterie a effacé cette adaptation. Solution : Nettoyer le papillon, puis lancer la procédure d'apprentissage avec Diagbox."
  },
  {
    col: 'casreels', slug: 'opel-corsa-voyant-egr-puissance',
    title: "Opel Corsa — voyant EGR et perte de puissance en charge",
    desc: "Code P0400. La soupape EGR est-elle vraiment bloquée ou est-ce le débitmètre qui signale le défaut ?",
    sys: "moteur", diff: "intermediaire", tools: '["scanner"]',
    body: "## Comment l'ECU voit l'EGR\nL'ECU ne voit pas les gaz d'échappement. Il ouvre l'EGR et s'attend à voir le débit d'air frais (MAF) CHUTER. Si les conduits EGR sont bouchés par la calamine, le MAF ne chute pas, et l'ECU déclare l'EGR en panne. Nettoyez les conduits !"
  },
  {
    col: 'casreels', slug: 'audi-a3-defaut-can-bus-demarrage',
    title: "Audi A3 — défaut CAN Bus intermittent au démarrage",
    desc: "Défauts Gateway. Problème de relais d'alimentation terminal 30 (Relais principal) qui fatigue à froid.",
    sys: "can", diff: "avance", tools: '["oscilloscope"]',
    body: "## Relais d'alimentation J317\nUn relais dont les contacts sont carbonisés provoque des micro-coupures de tension. L'oscilloscope sur l'alimentation de l'ECU montrait des chutes brutales à 4V au démarrage, plantant le bus CAN."
  },
  {
    col: 'casreels', slug: 'fiat-punto-p0420-catalyseur',
    title: "Fiat Punto — P0420 : catalyseur ou sonde lambda vieillissante ?",
    desc: "Comment utiliser l'oscilloscope sur les sondes Amont et Aval pour évaluer l'efficacité réelle du catalyseur.",
    sys: "moteur", diff: "intermediaire", tools: '["oscilloscope", "scanner"]',
    body: "## Analyse des signaux Lambda\nLa sonde amont doit osciller rapidement (0.1V - 0.9V). La sonde aval doit être *plate* autour de 0.6V. Si la sonde aval oscille exactement comme l'amont, le catalyseur est vide ou inefficace."
  },
  {
    col: 'casreels', slug: 'toyota-yaris-cale-froid',
    title: "Toyota Yaris — moteur qui cale au ralenti par temps froid",
    desc: "Valve IAC (Idle Air Control) bloquée par la calamine ou MAF très sale. Nettoyage vs remplacement.",
    sys: "moteur", diff: "debutant", tools: '["scanner"]',
    body: "## Valve IAC\nSur les anciens moteurs (non papillon motorisé), le by-pass d'air de ralenti se bloque. Démontez la valve et nettoyez le rotor au nettoyant carburateur."
  },
  {
    col: 'casreels', slug: 'hyundai-i20-calculateurs-absents',
    title: "Hyundai i20 — plusieurs calculateurs absents après intervention garage",
    desc: "Le garage a branché un accessoire aftermarket (autoradio/alarme) qui court-circuite le réseau CAN.",
    sys: "can", diff: "intermediaire", tools: '["multimetre"]',
    body: "## Autoradio Aftermarket et Ligne K / CAN\nLes adaptateurs radio génériques relient souvent la ligne CAN ou K-Line au 12V d'antenne, paralysant tout le réseau de la voiture. Débranchez l'autoradio et testez la communication."
  },
  {
    col: 'casreels', slug: 'mercedes-classe-a-demarrage-chaud-pression',
    title: "Mercedes Classe A — démarrage difficile à chaud, panne de pression carburant",
    desc: "Fuite interne d'un injecteur CDI ou joint torique de régulateur de pression rail qui se dilate.",
    sys: "moteur", diff: "avance", tools: '["kit_retour_injecteur"]',
    body: "## Régulateur de pression\nLe petit joint torique vert au bout du régulateur de pression (sur la rampe) se désagrège. À chaud, le gasoil fuit vers le retour, empêchant la montée à 250 bars. Remplacez le joint, pas la rampe."
  },
  {
    col: 'casreels', slug: 'seat-leon-p0101-maf-hors-plage',
    title: "Seat Leon — P0101 : MAF hors plage, câblage ou capteur ?",
    desc: "Un filtre à air mal monté ou de mauvaise qualité perturbe le flux laminaire de l'air sur le capteur.",
    sys: "moteur", diff: "debutant", tools: '["scanner"]',
    body: "## L'écoulement de l'air\nSi la boîte à air est cassée ou le filtre bon marché, des turbulences frappent le filament du MAF. La lecture devient erratique (P0101). Vérifiez toujours la filtration d'abord."
  },
  {
    col: 'casreels', slug: 'skoda-octavia-cle-demarre-plus-batterie',
    title: "Skoda Octavia — clé qui ne démarre plus après un dépannage batterie",
    desc: "Désynchronisation IMMO dans le combiné d'instruments (Dashboard) suite à un booster de démarrage.",
    sys: "immo", diff: "avance", tools: '["scanner"]',
    body: "## Le Danger des Boosters\nLes pics de tension des boosters bon marché corrompent l'EEPROM du porte-instruments. L'adaptation de l'antidémarrage est perdue. Il faut recoder la clé."
  },

  // COMMENT TESTER
  {
    col: 'capteurs', slug: 'tester-capteur-pmh-multimetre-oscilloscope',
    title: "Comment tester un capteur PMH au multimètre et à l'oscilloscope",
    desc: "Inductif (2 fils) vs Effet Hall (3 fils). Méthodologies de mesure de résistance et de signal carré/sinusoïdal.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre", "oscilloscope"]',
    body: "## Inductif vs Hall\nL'inductif génère son propre courant alternatif (AC). Testez sa résistance (souvent 500-1000 ohms). L'effet Hall nécessite 5V ou 12V, une masse, et renvoie un signal carré propre. Utilisez l'oscilloscope."
  },
  {
    col: 'actionneurs', slug: 'tester-injecteur-diesel-ou-essence',
    title: "Comment tester un injecteur diesel ou essence",
    desc: "Résistance électrique, test de signal, et test mécanique des débits/retours.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre", "kit_retour_injecteur"]',
    body: "## Essentiel\nPour l'essence : testez la résistance (12-14 ohms) et écoutez le clic (stéthoscope). Pour le Diesel Common Rail : utilisez les éprouvettes de retour. L'injecteur qui se remplit le plus vite est mort."
  },
  {
    col: 'actionneurs', slug: 'tester-bobine-allumage',
    title: "Comment tester une bobine d'allumage",
    desc: "Bobines crayon (COP), bobines jumostatiques. Tests de résistance primaire/secondaire et analyse oscilloscope.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre", "oscilloscope"]',
    body: "## Le temps de charge (Dwell)\nUn oscilloscope sur le fil de commande ou une pince ampèremétrique vous montrera la rampe de courant (0 à 6A). Si la rampe est verticale instantanément, la bobine est en court-circuit."
  },
  {
    col: 'actionneurs', slug: 'tester-relais-suspect',
    title: "Comment tester un relais suspecté défaillant",
    desc: "Oubliez le simple 'clic'. Apprenez à tester la chute de tension sur les contacts de puissance.",
    sys: "bcm", diff: "debutant", tools: '["multimetre"]',
    body: "## Le clic trompeur\nUn relais peut faire 'clic' (bobine OK) mais avoir ses contacts internes calcinés. Testez la continuité des broches 30 et 87 SOUS CHARGE."
  },
  {
    col: 'electricite', slug: 'tester-masse-moteur-ou-ecu',
    title: "Comment tester une masse moteur ou une masse ECU",
    desc: "Le test de chute de tension (Voltage Drop) appliqué aux masses de calculateurs et tresses de bloc moteur.",
    sys: "moteur", diff: "debutant", tools: '["multimetre"]',
    body: "## Le Voltage Drop\nPointe de multimètre sur la batterie (-), l'autre sur le bloc moteur. Actionnez le démarreur. Si > 0.5V, nettoyez la tresse de masse."
  },
  {
    col: 'electricite', slug: 'tester-alimentation-ecu',
    title: "Comment tester une alimentation ECU",
    desc: "Pinout, +12V permanent, +12V contact, et utilisation d'une ampoule de charge pour valider le faisceau.",
    sys: "ecu", diff: "intermediaire", tools: '["multimetre"]',
    body: "## Le Test de l'Ampoule\nLe multimètre a une impédance très élevée. Il lira 12V même si le fil ne tient que par un seul brin de cuivre. Testez l'alimentation de l'ECU avec une ampoule H7 (55W) branchée entre le +12V et la masse. Si elle brille, le faisceau peut porter du courant."
  },
  {
    col: 'electricite', slug: 'tester-cable-sans-continuite',
    title: "Comment tester un câble sans se fier uniquement à la continuité",
    desc: "Pourquoi le mode 'bip' de votre multimètre vous ment, et comment utiliser la charge pour isoler une coupure.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre"]',
    body: "## Loi d'Ohm\nLe mode continuité envoie 1 milliampère. Un seul fil de cuivre suffit à faire 'bip'. Toujours charger le circuit (ampoule ou composant branché) et mesurer la tension."
  },
  {
    col: 'can', slug: 'tester-reseau-can-bus-resistance-oscilloscope',
    title: "Comment tester un réseau CAN Bus (résistance et oscilloscope)",
    desc: "Test des 60 ohms, diagnostic des courts-circuits, et décodage visuel des trames H et L.",
    sys: "can", diff: "avance", tools: '["multimetre", "oscilloscope"]',
    body: "## Les 60 Ohms\nPrise OBD Pin 6 et 14, batterie débranchée. 60 ohms = Réseau sain. 120 ohms = Un fil est coupé. 0 ohm = Court-circuit entre H et L.\n## Oscilloscope\nLes signaux CAN-H (2.5V à 3.5V) et CAN-L (2.5V à 1.5V) doivent être des reflets parfaits (miroir)."
  },
  {
    col: 'actionneurs', slug: 'tester-alternateur-charge',
    title: "Comment tester un alternateur en charge",
    desc: "Tension, ondulation des diodes (Ripple) et pilotage LIN/BSS par l'ECU.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre", "oscilloscope"]',
    body: "## Alternateurs Pilotés\nSur les véhicules modernes, l'ECU pilote l'alternateur via le bus LIN. Une tension de 13V n'est pas forcément une panne si l'ECU a décidé d'économiser le moteur (Smart Charge). Lisez la 'consigne alternateur' au scanner."
  },
  {
    col: 'actionneurs', slug: 'tester-demarreur-electriquement',
    title: "Comment tester un démarreur électriquement",
    desc: "Courant d'appel (Inrush current), solénoïde, et chute de tension du gros câble.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre", "pince_amperemetrique"]',
    body: "## Pince Ampèremétrique\nUn démarreur de moteur 4 cylindres tire environ 150 à 250A au démarrage. S'il tire 500A, le démarreur est en court-circuit interne (usure) ou le moteur est grippé mécaniquement."
  },
  {
    col: 'actionneurs', slug: 'tester-electrovanne-egr',
    title: "Comment tester une électrovanne EGR",
    desc: "Test électrique de la bobine, pilotage PWM, et retour de position (potentiomètre).",
    sys: "moteur", diff: "intermediaire", tools: '["scanner", "multimetre"]',
    body: "## Nettoyage vs Électronique\nNettoyer la vanne mécanique ne sert à rien si la piste du potentiomètre de recopie est usée. Regardez en Live Data : 'Position demandée' vs 'Position réelle'. Si ça tressaute, la piste est morte."
  },
  {
    col: 'capteurs', slug: 'tester-capteur-map',
    title: "Comment tester un capteur MAP",
    desc: "Diagnostic du capteur de pression d'admission au voltmètre et avec une pompe à vide (Mityvac).",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre"]',
    body: "## Test Statique\nMoteur éteint, contact mis : le MAP doit afficher la pression atmosphérique (~1 bar / 1000 mbar). Moteur tournant au ralenti : la pression absolue dans l'admission chute à ~300 mbar (dépression)."
  },
  {
    col: 'capteurs', slug: 'tester-sonde-lambda',
    title: "Comment tester une sonde lambda amont et aval",
    desc: "Zirconium, Titane et Bande Large (Wideband). Mesure du chauffage et de l'oscillation.",
    sys: "moteur", diff: "avance", tools: '["oscilloscope", "scanner"]',
    body: "## Oubliez le multimètre pour le signal\nLe multimètre est trop lent pour voir une sonde vieillissante. Utilisez l'oscilloscope ou le scanner. La sonde amont doit basculer de pauvre à riche plus de 2 à 3 fois par seconde au ralenti."
  },

  // COMMENT VERIFIER
  {
    col: 'ecu', slug: 'verifier-ecu-hs-avant-remplacement',
    title: "Comment vérifier qu'un ECU est réellement HS avant de le remplacer",
    desc: "Les 4 piliers du fonctionnement d'un module : Alimentation, Masse, Wake-up, et Réseau de communication.",
    sys: "ecu", diff: "expert", tools: '["multimetre", "oscilloscope"]',
    body: "## Ne condamnez pas trop vite\nAvant de cloner un ECU, vérifiez le fil de Wake-up (Pin +12V après contact ou signal de réveil réseau). 30% des ECU remplacés en atelier ne sont pas défectueux, le problème était un faisceau oxydé ou un relais de gestion moteur fatigué."
  },
  {
    col: 'electricite', slug: 'verifier-chute-tension-defauts-multiples',
    title: "Comment vérifier une chute de tension qui provoque des défauts multiples",
    desc: "Quand 10 capteurs affichent un défaut simultanément, cherchez le fil de masse ou d'alimentation commun.",
    sys: "moteur", diff: "intermediaire", tools: '["multimetre"]',
    body: "## Epissures et points de masse\nSi les capteurs de pression rail, PMH, et température d'eau sortent en défaut 'Circuit haut', ils partagent probablement la même masse 5V issue du calculateur. Testez la ligne commune depuis l'ECU."
  },
  {
    col: 'ecu', slug: 'verifier-compatibilite-fichier-ecu-programmation',
    title: "Comment vérifier la compatibilité d'un fichier ECU avant programmation",
    desc: "HW Number, SW Number, Upgrades. Les règles absolues pour ne pas bricker un calculateur lors d'une écriture OBD ou Bench.",
    sys: "ecu", diff: "expert", tools: '["programmateur"]',
    body: "## HW avant SW\nLe Hardware Number (Numéro Matériel, ex: Bosch EDC17C10) doit être **STRICTEMENT IDENTIQUE** lors d'un clonage ou d'une restauration. Le Software Number (Logiciel) peut différer s'il s'agit d'une mise à jour de la marque, mais croiser des HW brûlera le calculateur."
  }
];

const writeArticles = () => {
  articles.forEach(art => {
    const dir = path.join('src/content', art.col);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, `${art.slug}.mdx`);
    
    // Tools array to JSON array parsing
    const content = `---
title: "${art.title}"
description: "${art.desc}"
pillar: "${art.col === 'ecu' || art.col === 'immo' ? 'programmation' : 'diagnostic'}"
category: "${art.col}"
system: "${art.sys}"
difficulty: "${art.diff}"
risk: "faible"
requiredTools: ${art.tools}
author: "DiagVault"
published_date: 2024-06-01T00:00:00.000Z
---

import EditorialPrinciple from '../../components/article/EditorialPrinciple.astro';
import TestStepCard from '../../components/article/TestStepCard.astro';
import ConfirmationBox from '../../components/article/ConfirmationBox.astro';
import DiagnosticTree from '../../components/article/DiagnosticTree.astro';

${art.body}
`;
    fs.writeFileSync(file, content);
  });
  console.log(`Generated ${articles.length} articles successfully!`);
}

writeArticles();
