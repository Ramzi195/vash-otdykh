/* ==========================================================================
   Ваш отдых — каталог товаров
   img      — путь к фото (кадрируется через CSS object-position, см. styles.css)
   pos      — object-position для object-fit:cover (фокус на товаре, обрезает
              шапку/подвал Instagram и часть наклеек по краям кадра)
   price    — число в ₽ или null, если цены нет на фото → кнопка "Узнать цену"
   priceNote— подпись рядом с ценой (например "за кг", "от")
   ========================================================================== */

const CATEGORIES = [
  { id: "all",       name: "Все товары",        nameEn: "All products" },
  { id: "grills",    name: "Мангалы и грили",   nameEn: "Grills & barbecues" },
  { id: "furniture", name: "Садовая мебель",    nameEn: "Garden furniture" },
  { id: "samovars",  name: "Самовары",          nameEn: "Samovars" },
  { id: "kazany",    name: "Казаны",            nameEn: "Cauldrons (kazans)" },
  { id: "castiron",  name: "Чугунная посуда",   nameEn: "Cast-iron cookware" },
  { id: "knives",    name: "Ножи и клинки",     nameEn: "Knives & blades" },
  { id: "giftsets",  name: "Наборы для пикника", nameEn: "Picnic gift sets" },
  { id: "drinks",    name: "Напитки",           nameEn: "Drinks" },
  { id: "steaks",    name: "Стейки",            nameEn: "Steaks" },
];

const PRODUCTS = [

  /* ───────── Мангалы и грили ───────── */
  {
    id: "grill-mangal-barbecue",
    cat: "grills",
    name: "Мангал + барбекю 4 мм",
    desc: "Прочный мангал-барбекю из стали 4 мм с откидной крышкой, разделочными полками и крышкой-гриль. На колёсах для удобной перевозки по участку.",
    price: null, priceNote: "узнать цену",
    img: "images/grill-mangal-barbecue.jpg", pos: "center 42%",
    badge: "hit", rating: 4.8,
  },
  {
    id: "grill-mangal-3in1",
    cat: "grills",
    name: "Мангал 3 в 1",
    desc: "Универсальная конструкция: мангал, коптильня и печь для казана в одном корпусе. Высокая дымовая труба, разборная решётка.",
    price: null, priceNote: "узнать цену",
    img: "images/grill-mangal-3in1.jpg", pos: "center 55%",
    badge: "new", rating: 4.7,
  },
  {
    id: "grill-mangal-roof",
    cat: "grills",
    name: "Мангал с крышей и полками",
    desc: "Заводская сборка, защитная арочная крыша от дождя, две деревянные разделочные полки и нижний ярус для дров.",
    price: null, priceNote: "узнать цену",
    img: "images/grill-mangal-roof.jpg", pos: "center 48%",
    badge: null, rating: 4.9,
  },
  {
    id: "grill-gas-performance",
    cat: "grills",
    name: "Газовый гриль Char-Broil Performance",
    desc: "Классический конвекционный газовый гриль. Чугунная решётка, пьезоэлектрический поджиг, надёжные горелки из нержавеющей стали, гарантия 5 лет.",
    price: 59900, priceNote: null,
    img: "images/grill-gas-performance.jpg", pos: "center 40%",
    badge: "hit", rating: 4.8,
  },
  {
    id: "grill-gas-professional",
    cat: "grills",
    name: "Газовый гриль Char-Broil Professional Core",
    desc: "Серия с инфракрасным преимуществом: еда не подгорает, жар распределяется равномерно по всей решётке, мясо остаётся сочнее. Гарантия 10 лет.",
    price: 104900, priceNote: null,
    img: "images/grill-gas-professional.jpg", pos: "center 38%",
    badge: null, rating: 5.0,
  },

  /* ───────── Садовая мебель ───────── */
  {
    id: "furniture-table-square",
    cat: "furniture",
    name: "Стол квадратный 95×95×75 см",
    desc: "Прочный пластиковый стол с фактурой плетёного ротанга. Не боится влаги и солнца, легко моется. Идеален для беседки или террасы.",
    price: 4850, priceNote: null,
    img: "images/furniture-table-square.jpg", pos: "center 45%",
    badge: null, rating: 4.6,
  },
  {
    id: "furniture-chair-rodos",
    cat: "furniture",
    name: "Кресло Rodos",
    desc: "Садовое кресло с подлокотниками, фактура плетёного ротанга. Штабелируется для компактного хранения, выдерживает уличные условия круглый год.",
    price: 2400, priceNote: null,
    img: "images/furniture-chair-rodos.jpg", pos: "center 48%",
    badge: "hit", rating: 4.7,
  },
  {
    id: "furniture-set-4chairs",
    cat: "furniture",
    name: "Комплект: стол + 4 стула",
    desc: "Готовый комплект садовой мебели для дачи или дома: квадратный стол и четыре кресла с подлокотниками в едином стиле.",
    price: 14450, priceNote: null,
    img: "images/furniture-set-4chairs.jpg", pos: "center 45%",
    badge: null, rating: 4.8,
  },
  {
    id: "furniture-set-6chairs",
    cat: "furniture",
    name: "Комплект: стол + 6 стульев",
    desc: "Большой обеденный комплект 160,5×94,5×75 см для семейного отдыха или приёма гостей в беседке. Стол и шесть кресел с подлокотниками.",
    price: 23750, priceNote: null,
    img: "images/furniture-set-6chairs.jpg", pos: "center 45%",
    badge: "hit", rating: 4.9,
  },

  /* ───────── Самовары ───────── */
  {
    id: "samovar-wood-builtin",
    cat: "samovars",
    name: "Самовар дровяной со встроенным заварником",
    desc: "Классический жаровой самовар на дровах со встроенным заварочным чайником. В наличии объёмы 3,5 л, 5 л и 8 л.",
    price: null, priceNote: "узнать цену",
    img: "images/samovar-wood-builtin.jpg", pos: "center 60%",
    badge: null, rating: 4.8,
  },
  {
    id: "samovar-wood-6l",
    cat: "samovars",
    name: "Самовар на дровах и углях, 6 л",
    desc: "Жаровой самовар классической формы на 6 литров. Работает на дровах и углях, подходит для дачи и выездов на природу.",
    price: null, priceNote: "узнать цену",
    img: "images/samovar-wood-6l.jpg", pos: "center 50%",
    badge: null, rating: 4.7,
  },
  {
    id: "samovar-sozen-10l",
    cat: "samovars",
    name: "Самовар на дровах и углях, 10 л",
    desc: "Большой жаровой самовар на 10 литров — хватит на большую компанию. Зеркальная полировка нержавеющей стали, кран с деревянной ручкой.",
    price: null, priceNote: "узнать цену",
    img: "images/samovar-sozen-10l.jpg", pos: "center 48%",
    badge: "hit", rating: 4.8,
  },
  {
    id: "samovar-turkish-zarifis",
    cat: "samovars",
    name: "Турецкий самовар жаровой, 8 л",
    desc: "Турецкий жаровой самовар Zarifis на 8 литров с двумя заварочными чайниками. Премиальная полировка, плавный двойной кран.",
    price: null, priceNote: "узнать цену",
    img: "images/samovar-turkish-zarifis.jpg", pos: "center 48%",
    badge: null, rating: 4.9,
  },
  {
    id: "samovar-3kettles-15l",
    cat: "samovars",
    name: "Самовар на дровах с тремя чайниками, 15 л",
    desc: "Внушительный жаровой самовар на 15 литров сразу с тремя заварочными чайниками — для большого застолья. Два крана, удобные деревянные ручки.",
    price: 24900, priceNote: null,
    img: "images/samovar-3kettles-15l.jpg", pos: "center 52%",
    badge: null, rating: 4.9,
  },
  {
    id: "samovar-ural-5l-set",
    cat: "samovars",
    name: "Уральский угольный самовар, 5 л — комплект",
    desc: "Угольный самовар из нержавеющей стали на 5 литров. В комплекте: самовар, крышка-заглушка для трубы, труба в подарок, заварочный чайник Vicalina 1 л и поднос. Готовое решение для чаепития.",
    price: 16499, priceNote: null,
    img: "images/samovar-ural-5l-set.jpg", pos: "center 42%",
    badge: "new", rating: 5.0,
  },

  /* ───────── Наборы для пикника ───────── */
  {
    id: "giftset-5",
    cat: "giftsets",
    name: "Набор для пикника №5",
    desc: "Подарочный набор в кейсе: шампуры, нож в чехле, четыре металлические стопки. Прекрасный подарок для тех, кто любит отдых на природе.",
    price: 6000, priceNote: null,
    img: "images/giftset-5.jpg", pos: "center 50%",
    badge: null, rating: 4.6,
  },
  {
    id: "giftset-1",
    cat: "giftsets",
    name: "Набор для пикника №1",
    desc: "Большой набор в кожаном кейсе: шампуры, нож, штопор, фляга для напитков и четыре стопки. Solid выбор для подарка мужчине.",
    price: 10000, priceNote: null,
    img: "images/giftset-1.jpg", pos: "center 48%",
    badge: "hit", rating: 4.8,
  },
  {
    id: "giftset-4",
    cat: "giftsets",
    name: "Набор для пикника №4",
    desc: "Максимальная комплектация: термос, фляга, шампуры, нож, штопор, вилки и ложки, миска и стопки — всё для отдыха на природе в одном кейсе.",
    price: 13600, priceNote: null,
    img: "images/giftset-4.jpg", pos: "center 48%",
    badge: null, rating: 4.9,
  },
  {
    id: "giftset-6",
    cat: "giftsets",
    name: "Набор для пикника №6",
    desc: "Набор в кейсе на подставке: шампуры, фляга, два ножа, штопор и четыре стопки. Эффектный подарок на юбилей или праздник.",
    price: 9500, priceNote: null,
    img: "images/giftset-6.jpg", pos: "center 45%",
    badge: null, rating: 4.7,
  },
  {
    id: "giftset-8",
    cat: "giftsets",
    name: "Набор для пикника №8",
    desc: "Набор шампуров с резными деревянными ручками, разделочный нож и шесть металлических стопок в кейсе с бархатной отделкой.",
    price: 7800, priceNote: null,
    img: "images/giftset-8.jpg", pos: "center 48%",
    badge: null, rating: 4.6,
  },
  {
    id: "giftset-10",
    cat: "giftsets",
    name: "Набор для пикника №10",
    desc: "Набор в кейсе: четыре стопки, разделочный нож, охотничий нож, фляга для напитков и шампуры с деревянными ручками.",
    price: 7400, priceNote: null,
    img: "images/giftset-10.jpg", pos: "center 48%",
    badge: "sale", rating: 4.5,
  },

  /* ───────── Напитки ───────── */
  {
    id: "drink-sparkling",
    cat: "drinks",
    name: "Игристый напиток J&W Classic, 750 мл",
    desc: "Безалкогольный игристый напиток из сока белого винограда, Испания. Без сахара, веганский состав, сертификат Халяль. Отличная альтернатива шампанскому для всей семьи.",
    price: null, priceNote: "узнать цену",
    img: "images/drink-sparkling.jpg", pos: "center 48%",
    badge: null, rating: 4.7,
  },
  {
    id: "drink-pomegranate",
    cat: "drinks",
    name: "Гранатовый сок прямого отжима, 1 л",
    desc: "Натуральный гранатовый сок прямого отжима без добавления сахара и консервантов. Отлично дополнит стол на пикнике или дома.",
    price: null, priceNote: "узнать цену",
    img: "images/drink-pomegranate.jpg", pos: "center 45%",
    badge: "hit", rating: 4.8,
  },

  /* ───────── Стейки GURMEAT ───────── */
  {
    id: "steak-ribeye-bone",
    cat: "steaks",
    name: "Стейк Рибай на кости",
    desc: "Мраморная говядина GURMEAT, замаринована и готова к жарке на мангале или гриле. Цена зависит от веса отруба.",
    price: null, priceNote: "цена за кг — уточняйте",
    img: "images/steak-ribeye-bone.jpg", pos: "center 50%",
    badge: "hit", rating: 4.9,
  },
  {
    id: "steak-ribeye-boneless",
    cat: "steaks",
    name: "Стейк Рибай без кости",
    desc: "Классический рибай без кости от GURMEAT, насыщенная мраморность, готов к жарке. Цена зависит от веса отруба.",
    price: null, priceNote: "цена за кг — уточняйте",
    img: "images/steak-ribeye-boneless.jpg", pos: "center 50%",
    badge: null, rating: 4.8,
  },
  {
    id: "steak-tomahawk",
    cat: "steaks",
    name: "Стейк Томагавк",
    desc: "Эффектный стейк на длинной кости от GURMEAT — украшение любого праздничного стола на природе. Цена зависит от веса отруба.",
    price: null, priceNote: "цена за кг — уточняйте",
    img: "images/steak-tomahawk.jpg", pos: "center 45%",
    badge: "new", rating: 5.0,
  },
  {
    id: "steak-striploin",
    cat: "steaks",
    name: "Стейк Стриплойн",
    desc: "Стриплойн от GURMEAT — плотная текстура и насыщенный вкус говядины. Уже замаринован и готов к жарке. Цена зависит от веса отруба.",
    price: null, priceNote: "цена за кг — уточняйте",
    img: "images/steak-striploin.jpg", pos: "center 50%",
    badge: null, rating: 4.7,
  },
  {
    id: "steak-tbone",
    cat: "steaks",
    name: "Стейк Тибон",
    desc: "Тибон от GURMEAT сочетает вырезку и стриплойн в одном куске — два вкуса сразу. Цена зависит от веса отруба.",
    price: null, priceNote: "цена за кг — уточняйте",
    img: "images/steak-tbone.jpg", pos: "center 50%",
    badge: null, rating: 4.8,
  },

  /* --- Казаны --- */
  {
    id: "kazan-turkish-25l", cat: "kazany", name: "Казан-скороварка турецкая 25л",
    desc: "Традиционный турецкий казан-скороварка с чугунной крышкой и нержавеющим корпусом 25 литров. Идеален для плова, тушения мяса и приготовления супов.",
    price: null, priceNote: "узнать цену", img: "images/kazan-01.jpg", pos: "center 40%", badge: "hit", rating: 4.9,
  },
  {
    id: "kazan-turkish-50l", cat: "kazany", name: "Казан-скороварка турецкая 50л",
    desc: "Большой турецкий казан-скороварка 50 литров для больших компаний. Двойная крышка с клапаном безопасности, нержавеющая чаша.",
    price: null, priceNote: "узнать цену", img: "images/kazan-02.jpg", pos: "center 40%", badge: "new", rating: 4.8,
  },

  /* --- Чугунная посуда --- */
  {
    id: "cast-iron-set-3", cat: "castiron", name: "Набор чугунных сковородок 3 шт",
    desc: "Комплект из трёх чугунных сковородок разного диаметра: гриль-сковорода с рёбрами, блинница и универсальная. Деревянные ручки.",
    price: null, priceNote: "узнать цену", img: "images/cast-iron-set-01.jpg", pos: "center 40%", badge: "hit", rating: 4.8,
  },
  {
    id: "cast-iron-grill-pan", cat: "castiron", name: "Сковорода-гриль чугунная 28см",
    desc: "Круглая чугунная сковорода-гриль с диагональными рёбрами. Даёт красивый рисунок на мясе, равномерно распределяет жар.",
    price: null, priceNote: "узнать цену", img: "images/cast-iron-grill-01.jpg", pos: "center 40%", badge: null, rating: 4.7,
  },
  {
    id: "cast-iron-napoleon", cat: "castiron", name: "Сковорода Napoleon чугунная",
    desc: "Оригинальная чугунная сковорода Napoleon. Совместима с газовыми, электрическими и индукционными плитами.",
    price: null, priceNote: "узнать цену", img: "images/cast-iron-napoleon-01.jpg", pos: "center 40%", badge: "new", rating: 4.9,
  },
  {
    id: "cast-iron-skillet", cat: "castiron", name: "Чугунная сковорода с деревянной ручкой",
    desc: "Классическая чугунная сковорода с деревянной съёмной ручкой. Подходит для стейков, яичницы, выпечки. Диаметр 26 см.",
    price: null, priceNote: "узнать цену", img: "images/cast-iron-skillet-01.jpg", pos: "center 50%", badge: null, rating: 4.6,
  },

  /* --- Ножи и клинки --- */
  {
    id: "knife-kizlyar-dagestan", cat: "knives", name: "Кизлярский нож «Дагестан»",
    desc: "Традиционный кизлярский нож ручной работы с кожаными ножнами. Клинок из высокоуглеродистой стали, рукоять из натуральной кожи с декором.",
    price: null, priceNote: "узнать цену", img: "images/knife-kizlyar-01.jpg", pos: "center 45%", badge: "hit", rating: 4.9,
  },
  {
    id: "knife-hunting-set", cat: "knives", name: "Набор охотничьих ножей 4 шт",
    desc: "Комплект из 4 охотничьих ножей с деревянными рукоятями на подставке. Ручная ковка, высококачественная сталь.",
    price: null, priceNote: "узнать цену", img: "images/knife-hunting-01.jpg", pos: "center 40%", badge: "new", rating: 4.8,
  },
  {
    id: "knife-pchak-uzbek", cat: "knives", name: "Пчак узбекский",
    desc: "Традиционный узбекский нож-пчак с характерным клинком и расписной рукоятью. Идеален для разделки мяса и нарезки овощей.",
    price: null, priceNote: "узнать цену", img: "images/knife-pchak-01.jpg", pos: "center 40%", badge: null, rating: 4.7,
  },
  {
    id: "knife-cleaver-steel", cat: "knives", name: "Тяпка для мяса кованая",
    desc: "Стальная кованая тяпка-тесак для разделки мяса. Увесистый клинок из закалённой стали, эргономичная рукоять.",
    price: null, priceNote: "узнать цену", img: "images/knife-cleaver-01.jpg", pos: "center 40%", badge: null, rating: 4.7,
  },
  {
    id: "knife-katana-decorative", cat: "knives", name: "Катана декоративная на подставке",
    desc: "Декоративная японская катана на деревянной подставке. Металлический клинок с гравировкой, традиционная обмотка. Отличный подарок.",
    price: null, priceNote: "узнать цену", img: "images/knife-katana-01.jpg", pos: "center 40%", badge: null, rating: 4.6,
  },
  {
    id: "knife-axe-tactical", cat: "knives", name: "Топор туристический",
    desc: "Прочный туристический топор для кемпинга, охоты и заготовки дров. Острое лезвие из инструментальной стали.",
    price: null, priceNote: "узнать цену", img: "images/knife-axe-01.jpg", pos: "center 40%", badge: null, rating: 4.5,
  },

  /* --- Новые наборы для пикника --- */
  {
    id: "giftset-bbq-premium", cat: "giftsets", name: "Набор для шашлыка «Премиум» в кейсе",
    desc: "Роскошный набор в кожаном кейсе: 6 шампуров с деревянными рукоятками, кизлярский нож, 6 рюмок из нержавейки. Отличный подарок.",
    price: null, priceNote: "узнать цену", img: "images/giftset-new-01.jpg", pos: "center 30%", badge: "hit", rating: 4.9,
  },
  {
    id: "giftset-bbq-deluxe", cat: "giftsets", name: "Набор для шашлыка «Deluxe» с флягой",
    desc: "Подарочный набор «Deluxe» в тёмно-коричневом кейсе: шампура, нож, тяпка, фляга, рюмки, зажигалка.",
    price: null, priceNote: "узнать цену", img: "images/giftset-new-03.jpg", pos: "center 35%", badge: "new", rating: 4.8,
  },
  {
    id: "giftset-bbq-complete", cat: "giftsets", name: "Набор для шашлыка полный в чемодане",
    desc: "Полный набор в большом кожаном чемодане: шампура, рюмки, термос, приборы, нож, фляга. Для настоящих посиделок.",
    price: null, priceNote: "узнать цену", img: "images/giftset-new-04.jpg", pos: "center 30%", badge: null, rating: 4.7,
  },
];
