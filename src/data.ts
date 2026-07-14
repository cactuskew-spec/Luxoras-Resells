import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'nike-nba-drifit',
    name: 'Nike Pro NBA Dri-Fit marškinėliai',
    brand: 'NIKE',
    category: 'MARŠKINĖLIAI',
    price: 28,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Aukščiausios kokybės Nike Pro NBA marškinėliai su Dri-Fit technologija, kuri efektyviai garina drėgmę ir palaiko vėsumą. Idealiai tinka tiek krepšinio treniruotėms, tiek aktyviam laisvalaikiui gatvėje. Elastingas audinys prisitaiko prie kūno formų ir užtikrina maksimalų judėjimo laisvumą.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'baby-milo-ch',
    name: 'Baby Milo marškinėliai',
    brand: 'CHROME HEARTS x BAPE',
    category: 'MARŠKINĖLIAI',
    price: 95,
    imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342283035-480b3c003844?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Išskirtinis Chrome Hearts ir BAPE kolaboracijos modelis su ikonišku Baby Milo dizainu. Pagamintas iš itin tvirtos, storos medvilnės, pasižymi unikaliu gotikinio stiliaus šriftu nugaroje. Tai itin retas, riboto leidimo (limited drop) drabužis tikriems streetwear entuziastams.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'air-max-95-triple-black',
    name: 'Air Max 95 „Triple Black“',
    brand: 'NIKE',
    category: 'BATAI',
    price: 120,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Klasikinio silueto Air Max 95 batai pilnai juodos „Triple Black“ spalvos. Anatominiu dizainu pasižymintis padas su matomomis Air oro pagalvėmis kulno ir priekinėje dalyse užtikrina neprilygstamą amortizaciją ir komfortą kiekviename žingsnyje.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'air-max-95-neon',
    name: 'Air Max 95 OG „Neon“',
    brand: 'NIKE',
    category: 'BATAI',
    price: 145,
    imageUrl: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Sugrįžusi legenda – Air Max 95 OG su ryškiomis neoninėmis detalėmis. Šis kultinis modelis įkvėptas žmogaus anatomijos: pado dizainas atkartoja stuburą, o sluoksniuota tekstūra simbolizuoja raumenis. Tikras kolekcininkų troškimas.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'air-max-95-pink',
    name: 'Air Max 95 „Pink Rose“',
    brand: 'NIKE',
    category: 'BATAI',
    price: 135,
    imageUrl: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Švelnių rožinių ir pastelinių atspalvių derinys populiariajame Air Max siluete. Šie batai ne tik traukia akį gatvėje, bet ir suteikia puikią amortizaciją kasdieniam nešiojimui. Puikiai dera prie šviesių gatvės mados derinių.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'birkenstock-boston',
    name: 'Birkenstock Boston Suede',
    brand: 'BIRKENSTOCK',
    category: 'BATAI',
    price: 110,
    imageUrl: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Klasikinės zomšinės klumpės, tapusios neatsiejama jaukios miesto mados dalimi. Boston modelis pasižymi anatomiškai išformuotu kamštiniu padu, kuris su laiku idealiai prisitaiko prie pėdos linkių, bei reguliuojamu odiniu dirželiu.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'asics-gel-kayano',
    name: 'Asics Gel-Kayano 14 Metallic',
    brand: 'ASICS',
    category: 'BATAI',
    price: 115,
    imageUrl: 'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Y2K bėgimo batų estetikos įkvėpti Asics Gel-Kayano 14 su metalizuotomis detalėmis. Užtikrina ypatingą stabilizaciją ir legendinį Gel pado minkštumą. Šiuo metu tai vienas populiariausių siluetų pasaulyje.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'crocs-mcqueen',
    name: 'Crocs Lightning McQueen',
    brand: 'CROCS',
    category: 'BATAI',
    price: 65,
    imageUrl: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1560343090-f0409e92791a?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Visiškas interneto sensacijos hitas – Crocs klumpės su Žaibo Makvyno (Lightning McQueen) dizainu, kurios šviečia žengiant žingsnį! Pagamintos iš lengvos Croslite medžiagos su ventiliacijos angomis ir reguliuojamu dirželiu.',
    sizes: ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  },
  {
    id: 'stone-island-beanie',
    name: 'Stone Island Ribbed Beanie',
    brand: 'STONE ISLAND',
    category: 'KEPURĖS',
    price: 45,
    imageUrl: 'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d4aa53e?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Megzta Stone Island kepurė, pagaminta iš aukščiausios kokybės vilnos mišinio. Švelni, tampri, rumbuoto mezgimo struktūra puikiai priglunda ir šildo šaltuoju sezonu. Priekyje prisiūtas ikoniškas Stone Island Compass logotipas.',
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'palace-triferg-hoodie',
    name: 'Palace Tri-Ferg Hoodie Black',
    brand: 'PALACE',
    category: 'MEGZTINIAI',
    price: 160,
    imageUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Sunkios, tankios medvilnės Palace džemperis su kapišonu, papuoštas žymiuoju Tri-Ferg trikampio logotipu nugaroje. Patogus, laisvo kirpimo (boxy fit) siluetas, užtikrinantis nepriekaištingą gatvės stiliaus įvaizdį.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'supreme-baggy-pants',
    name: 'Supreme Baggy Cargo Pants',
    brand: 'SUPREME',
    category: 'KELNĖS',
    price: 130,
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Plačios, laisvo modelio Supreme cargo kelnės su didelėmis šoninėmis kišenėmis. Pagamintos iš patvaraus ripstop audinio, atsparaus nusidėvėjimui. Reguliuojamas juosmuo ir kelnių apačia leidžia lengvai keisti siluetą.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'stussy-stock-shorts',
    name: 'Stussy Water Work Shorts',
    brand: 'STUSSY',
    category: 'ŠORTAI',
    price: 55,
    imageUrl: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Stussy vandenį atstumiantys laisvalaikio šortai iš greitai džiūstančio nailono audinio. Turi patogią elastinę juostą su virvele reguliavimui ir tinklinį pamušalą viduje. Puikiai tinka tiek karštoms miesto dienoms, tiek maudynėms.',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  },
  {
    id: 'supreme-backpack-olive',
    name: 'Supreme Cordura Backpack Olive',
    brand: 'SUPREME',
    category: 'KUPRINĖS',
    price: 140,
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1577733966973-d6b9162747df?q=80&w=600&auto=format&fit=crop'
    ],
    description: 'Itin tvirta ir atspari Supreme kuprinė, pagaminta iš Cordura balistinio nailono audinio. Su specialiu nešiojamo kompiuterio skyriumi bei ergonomiškomis petnešomis. Alyvuogių žalumo spalva suteikia karinio modernaus stiliaus akcentą.',
    sizes: ['One Size']
  }
];
