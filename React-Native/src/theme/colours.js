// Colours - as per http://chir.ag/projects/name-that-color

const colours = {
  abbey: '#51585f',
  alabaster: '#F8F8F8',
  alabaster2: '#F7F7F7',
  alizarianCrimson: '#E73324',
  alizarinCrimson: '#DA2328',
  alto3: '#dbdbdb',
  alto2: '#DEDEDE',
  alto: '#D6D6D6',
  aluminium: '#A7A9AC',
  amethystSmoke: '#AAA4BA',
  anzac: '#D8B352',
  anzack: '#d8b64b',
  apple: '#54B948',
  aquaIsland: '#AED6DF',
  aquamarineBlue: '#66cae2',
  astra: '#f9f5b0',
  astral: '#34739B',
  athensGray: '#e7eaf0',
  atlantis: '#70BA27',
  azure: '#385AA8',
  bahia: '#A4D90F',
  bianca: '#fbf9f1',
  black: '#040404',
  blackHaze: '#E6E7E7',
  blackSqueeze: '#E1F4F4',
  blizzardBlue: '#AAD4EF',
  blueHaze: '#C2CBDB',
  blueHaze2: '#C2C3DC',
  blueHaze3: '#CBCDE3',
  blueHaze4: '#CBD3E1',
  blueLagoon: '#00808e',
  bombay: '#B1B3B6',
  bonJour: '#E0DCDC',
  botticelli: '#D4DBE8',
  boulder: '#757575',
  brilliantRose: '#F44EBB',
  buccaneer: '#6f3842',
  buff: '#F2CB84',
  buttermilk: '#FFEDB1',
  brightSun: '#F8D13E',
  cadetBlue: '#A7AFBF',
  candyCorn: '#F6F654',
  carnation: '#F15154',
  carnationPink: '#FDA6BE',
  carrotOrange: '#F6931D',
  casper: '#AAB8D0',
  catskillWhite: '#F5F7FA',
  cerise: '#D023A1',
  cerulean: '#05AEF0',
  chablis: '#fff0f0',
  chambray: '#364D9B',
  chateauGreen: '#37B44E',
  chateauGreen2: '#39B54A',
  christi: '#5C9512',
  cinderella2: '#FDD9D9',
  cinnabar2: '#E23D44',
  cinnabar: '#EF5928',
  cloudGray: '#8d8d8d',
  cloudy: '#B4AFA8',
  codGray: '#0C0C0C',
  cornField: '#F8F6BF',
  cornflowerBlue: '#6F75FF',
  corvette: '#fbd19d',
  cosmic: '#72346E',
  crimson: '#ED1C24',
  cumulus: '#FFFDD5',
  danube: '#5b91cc',
  danube2: '#5fa1d6',
  danube3: '#5F81CE',
  denim: '#1B75BC',
  dodgerBlue: '#2086FC',
  doveGray2: '#666666',
  doveGray: '#707070',
  drover: '#FCEEA3',
  dustyGray: '#9B9B9B',
  dullLavender: '#938de8',
  ecruWhite: '#FCFCF7',
  emerald2: '#46c764',
  emerald3: '#3ECB54',
  emerald: '#63C973',
  emporer: '#535353',
  eucalyptus: '#2eb24a',
  feta2: '#F7FEF4',
  feta: '#fafdf4',
  fireBush: '#E5A42B',
  flamingo: '#F66E2C',
  forestGreen: '#289a3a',
  fountainBlue: '#65bec7',
  frenchGray: '#CDCDCE',
  frenchLilac: '#F7EBFA',
  frenchRose: '#F25579',
  fruitSalad: '#5ca754',
  funBlue: '#175B9F',
  fuschiaBlue: '#884DBB',
  givry: '#f7f2b6',
  gold: '#FFD602',
  goldenDream: '#EFE137',
  grannySmithApple: '#8ae493',
  gray3: '#AAAAAA',
  gray2: '#888888',
  gray: '#828282',
  grayChateau: '#A6A9AC',
  greenYellow: '#A4F456',
  guardsmanRed: '#bd0000',
  halfAndHalf: '#FFFEE0',
  halfBaked: '#87c8d2',
  halfColonialWhite: '#FDFBCB',
  harlequin: '#37CE00',
  havelockBlue: '#649EDD',
  hawkesBlue: '#E0EDFC',
  heather2: '#B3BCCB',
  heather: '#C2CBD9',
  hippieBlue: '#528DB2',
  hoki: '#6a7da2',
  hummingBird: '#DCEDFA',
  iceberg: '#DBF0F4',
  iron2: '#CCCDCE',
  iron: '#E5E6E7',
  ivory: '#fffff9',
  jaffa: '#f2a039',
  jaggedIce: '#CDEDEB',
  jordyBlue: '#90B2F7',
  jungleGreen: '#23A89C',
  kournikova: '#FFE16E',
  killarney: '#3C763D',
  lavender2: '#E2F0F8',
  lavender: '#CEDBF4',
  lavenderGrey: '#C2C3DC',
  lemon: '#EEE809',
  lightGoldenrodYellow: '#EDFDE7',
  lightGrey: '#EFEFEF',
  lightningYellow: '#FDBB13',
  lilyWhite: '#EAF8FF',
  lima: '#79D023',
  lima2: '#75D21D',
  lima3: '#6BC11A',
  limeade: '#61C400',
  limeade2: '#26A500',
  linkWater2: '#DEE6F7',
  linkWater3: '#F6F7FD',
  linkWater4: '#EAF0F9',
  linkWater5: '#E0E8F4',
  linkWater: '#EEF3FB',
  lochmara3: '#0189D0',
  lochmara2: '#0089CF',
  lochmara: '#0078D9',
  logan: '#A1A2C9',
  lola: '#ede6ec',
  magnolia: '#F9F2FF',
  malibu2: '#5fa5ff',
  malibu3: '#56C5FD',
  malibu4: '#89d6f8',
  malibu: '#86DEF5',
  manatee: '#9690A8',
  mandy: '#E05656',
  mantis: '#68C879',
  manz: '#FFF474',
  marigoldYellow: '#f9d676',
  mariner: '#3B5FD0',
  maverick: '#DAC1D6',
  mediumPurple: '#734DDB',
  mediumPurple2: '#7A62DB',
  mercury: '#E6E6E6',
  midGray: '#606063',
  mimosa: '#EFFDD9',
  mineShaft2: '#212121',
  mineShaft: '#333333',
  mischka: '#d8dbe0',
  mojo2: '#cc484a',
  mojo3: '#C44444',
  monarch: '#9D072E',
  monza: '#D8061E',
  moodyBlue: '#666ED0',
  moonRaker: '#E0DAF7',
  naturalGrey: '#888786',
  nepal: '#92a4c0',
  nobel2: '#B5B5B5',
  nobel: '#B7B7B7',
  oasis: '#fde3c4',
  paleSky: '#647983',
  paleSlate: '#C6C4C6',
  pastelGreen: '#71D17D',
  pattensBlue2: '#D9E6FF',
  pattensBlue3: '#E8F1FF',
  pattensBlue: '#DEF5FF',
  peach: '#FFE5BB',
  peppermint: '#f1faef',
  peppermint2: '#D4F1D8',
  perano: '#ABD3F2',
  perano2: '#A0A7F5',
  perfume: '#BAA5F5',
  periwinkleGray2: '#D6DDEE',
  periwinkleGray: '#B6C6E2',
  persianGreen: '#00A69C',
  pickledBluewood: '#33435e',
  pigeonPost: '#B4C2DE',
  pirateGold: '#c77c00',
  plum3: '#90268E',
  plum2: '#E2A5D1',
  plum: '#79306f',
  polar2: '#F0FCFC',
  polar: '#edfafb',
  poloBlue: '#95a8cc',
  porcelain: '#EDF0F2',
  portage: '#99B3DD',
  potPourri2: '#f7ede7',
  prim2: '#F2E6F0',
  prim: '#EFDFEC',
  quarterSpanishWhite: '#F8F1E2',
  quartz2: '#EDE9F8',
  quartz: '#C6D3ED',
  quilGray: '#DCDBD6',
  raspberry10: '#FCE9EF',
  raspberry: '#E30B5D',
  rawSienna: '#CE773F',
  red: '#e00000',
  red2: '#FF0000',
  red3: '#fa000a',
  redDamask: '#D6763D',
  redRibbon: '#F21E3C',
  regentStBlue: '#A3B9E1',
  rhino: '#343465',
  riceFlower: '#F4FFE9',
  rockBlue: '#A2B0C9',
  rollingStone: '#777C84',
  roman: '#DC676C',
  royalBlue2: '#475eda',
  royalBlue3: '#5677E0',
  royalBlue: '#1a73e8',
  allports: '#0166A5',
  scooter: '#2AB4D3',
  seaBuckthorn: '#FBAA26',
  seaGreen: '#2dac41',
  selago3: '#EFF6FD',
  selago2: '#DDE7FA',
  selago: '#E0E9FA',
  selagoLavender: '#EDEEFC',
  serenade: '#FFF6E8',
  shalimar: '#FFFCBA',
  shark: '#1d2022',
  shamrock: '#2EC675',
  shipCove: '#7692C7',
  silver: '#CACACA',
  silver2: '#bbbbbb',
  silverChalice: '#9E9E9E',
  sinbad: '#9DCBD1',
  skyBlue: '#71C7EC',
  solitaire: '#FEF2E4',
  spindle3: '#A1B6E6',
  spindle4: '#acbee8',
  spindle5: '#AEC7EB',
  spunPearl: '#AEAFB9',
  steelBlue: '#4A81BE',
  steelBlue2: '#5275B8',
  stiletto: '#A63433',
  sun: '#FCAF17',
  sunglo: '#e57373',
  sundance: '#cbc761',
  sushi: '#8DC63F',
  suvaGray: '#7D7B7D',
  tahunaSands: '#E6F0CB',
  tangerine: '#EC9100',
  terracotta: '#EB706D',
  texas: '#FAF69C',
  titanWhite: '#F4F4FF',
  transparent: 'rgba(0,0,0,0)', // Useful for transitions between no fill and fill.,
  travertine: '#FFFDE8',
  tuna: '#36354a',
  tundora: '#4A4A4A',
  turquoise: '#31D0B7',
  twilight2: '#F8FDFF',
  twilight: '#E3D0E1',
  valencia: '#dc4848',
  viking: '#62DED2',
  viola2: '#D090D0',
  viola: '#BF7BA6',
  violetEggplant: '#B505B5',
  violetEggplant2: '#B513B5',
  vividTangerine: '#ff8c8c',
  waikawaGray: '#5670AB',
  waterloo: '#868497',
  wePeep: '#F8E2E2',
  whisper2: '#f6f6fa',
  whisper3: '#EBDEDE',
  whisper: '#ede7ee',
  white: '#FFFFFF',
  whiteIce2: '#D4F7F0',
  whiteIce: '#DDEDF9',
  whiteLilac: '#EFF0F8',
  whiteTransparentLess: 'rgba(255,255,255,0.7)',
  whiteTransparentMore: 'rgba(255,255,255,0.4)',
  wildBlueYonder: '#8894bc',
  wildWaterMelon: '#ff487b',
  wildWillow: '#a1c163',
  witchHaze: '#FDF999',
  yellowGreen: '#CCE16F',
  yellowOrange: '#FFA64D',
  yourPink: '#ffc0c0',
  zircon2: '#f8fbff',
  zircon3: '#EDF3FF',
  zircon4: '#F2F5FF',
  zircon5: '#F5F8FF',
  zircon6: '#F7FEF4',
  zircon7: '#F2F6FF',
  zircon8: '#eff5ff',
  zircon: '#eff3ff',

  // writingTools top nav bar
  aliceBlue2: '#F0FAFF',
  aliceBlue: '#e3eaff',
  solitude: '#dde6ff',
  spindle2: '#A6BEEA',
  spindle: '#c1cff0',

  //Sentence Styles
  affair: '#6a3f7f',
  aquaHaze2: '#e4f0f0',
  asparagus: '#81A568',
  astronaut: '#293E77',
  beautyBush: '#efc7cf',
  blackWhite: '#FFFEF3',
  brickRed: '#c73652',
  brinkPink: '#FC747A',
  burgundy: '#A2012D',
  butterflyBush: '#574F85',
  butteryWhite: '#fffdeb',
  cavernPink: '#eac5c5',
  chelseaCucumber: '#86b860',
  chetwodeBlue: '#7983D6',
  cinderella: '#fde7e0',
  coconutCream: '#F8F7DA',
  coldPurple: '#A1B6DE',
  coldTurkey: '#d2c3c8',
  congoBrown: '#53333e',
  curiousBlue: '#1D80C3',
  curiousBlue2: '#27A9E0',
  dandelion: '#FFDA60',
  deepCerulean: '#0075AB',
  dingley: '#768247',
  dustStorm: '#e3cacd',
  eminence: '#6D3283',
  fantasy: '#faf0f0',
  frost: '#f6faec',
  gin: '#DEEBE4',
  hintOfYellow: '#FDFDE5',
  hippieGreen: '#487D49',
  illusion: '#F5A5BB',
  inchWorm: '#A3ED3C',
  jungleMist: '#c5ddde',
  lightOrchid: '#DC9ADC',
  macaroniAndCheese: '#FFBF73',
  mandysPink: '#f3cbbe',
  mexicanRed: '#A22242',
  mojo: '#c65b38',
  monaLisa: '#FF8E8E',
  mystic: '#D8DDE8',
  onahau: '#cfe4ff',
  orinoco: '#e6f8cf',
  potPourri: '#f7e9e9',
  powderAsh: '#bccdc4',
  quarterPearlLusta: '#FFFCF2',
  remy: '#FEE8EF',
  seagull: '#79CAED',
  selectiveYellow: '#F4BB01',
  smokey: '#58526E',
  snuff2: '#E1E2F2',
  snuff: '#dfcfe5',
  softPeach: '#f2e7eb',
  solidPink: '#863540',
  stromboli: '#335844',
  sulu: '#B2EB82',
  tana: '#dce2cb',
  teaGreen: '#ddf1cd',
  vistaWhite: '#f8ecee',
  vermilion: '#FF3F00',
  walnut: '#743917',
  wedgewood: '#468f94',
  wellRead: '#b53533',
  whitePointer: '#FCF4FF',
  yellow: '#FFF500',
  zumthor2: '#E2ECFF',
  zumthor: '#ebf4ff',
  azureradiance: '#00acff',
  ceruleandark: '#1191e2',
  orient: '#005a8d',
  cioccolato: '#5b2c0b',

  // markingUnderlineHighlight
  froly: '#F0648B',
  pastelGreen2: '#6BDF72',
  curiousBlue3: '#1D8BDB',
  crimson2: '#CB142B',
  orangePeel: '#FF9800',

  // markingHighlight
  yourPink2: '#FDC3C2',
  gossip: '#BDF9B4',
  periwinkle: '#CEDFFF',
  melon: '#FDB8A3',
  lemonChiffon: '#FFF9C4',
  cherub: '#F9D4EB',
  creamBrulee: '#FEE9A2',
  alto4: '#E0E0E0',
};

/**
 * Convert a hexadecimal integer to a decimal integer.
 *
 * @param {string} hex Hexadecimal integer.
 * @returns {number} Decimal integer.
 */
const hexToInt = (hex) => parseInt(parseInt(hex, 16).toString(10));

/**
 * Convert a hex colour with preceding "#" to array of rgb.
 *
 * @param hex
 * @returns {[*, *, *]}
 */
const hexToRgb = (hex) => [
  hexToInt(hex.substring(1, 3)),
  hexToInt(hex.substring(3, 5)),
  hexToInt(hex.substring(5, 7)),
];

/**
 * Get an rgba colour from a given 6-digit hex colour and an alpha value (defaults to 1).
 *
 * @param {string} colour 6-digit hex rgb colour or a property of the above colours object.
 * @param {number} alpha Alpha channel value.
 * @returns {string} rgba colour.
 */
const rgba = (colour, alpha = 1) => {
  if (typeof colour !== 'string') {
    throw Error(`colour argument must be a string, got ${colour}`);
  }
  let hex;
  if (colour[0] === '#') {
    hex = colour;
    if (hex.length !== 7) {
      throw Error(`Hex colour must have length of 7, got ${colour}`);
    }
  } else {
    hex = colours[colour];
    if (!hex) {
      throw Error(`Could not find a defined colour for ${colour}`);
    }
  }

  const rgb = hexToRgb(hex);

  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`;
};

/**
 * Convert a hex colour with preceding "#" to array of hsv.
 *
 * @param {string} hex
 * @returns {[number, number, number]}
 */
const hexToHsv = (hex) => {
  let [r, g, b] = hexToRgb(hex);

  r /= 255;
  g /= 255;
  b /= 255;

  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    v = max;

  let d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max === min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return [h, s, v];
};

const utils = {
  hexToHsv,
  hexToInt,
  hexToRgb,
  rgba,
};

export default {
  ...colours,
  utils,
};
