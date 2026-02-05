const fs = require('fs');
const path = require('path');

// All the locations provided by the user
const allLocations = [
  // Texas cities
  "Houston", "San Antonio", "Addison", "Allen", "Alvin", "Angleton", "Anna", "Arlington", "Austin", "Azle", "Bacliff", "Balch Springs", "Bastrop", "Baytown", "Bedford", "Bellaire", "Belton", "Bonham", "Bryan", "Burleson", "Carrollton", "Cedar Hill", "Cedar Park", "Celina", "Channelview", "Cleburne", "College Station", "Colleyville", "Commerce", "Conroe", "Coppell", "Copperas Cove", "Corsicana", "Crowley", "Dallas", "Dayton", "Deer Park", "Denison", "Denton", "Desoto", "Dickinson", "Duncanville", "El Paso", "Elgin", "Ennis", "Euless", "Fate", "Flower Mound", "Forney", "Fort Hood", "Fort Worth", "Fresno", "Friendswood", "Frisco", "Fulshear", "Gainesville", "Galena Park", "Galveston", "Garland", "Gatesville", "Georgetown", "Grand Prairie", "Grapevine", "Greenville", "Haltom City", "Harker Heights", "Helotes", "Hewitt", "Hillsboro", "Humble", "Huntsville", "Hurst", "Hutto", "Irving", "Joshua", "Katy", "Keller", "Kennedale", "Killeen", "La Marque", "La Porte", "Lancaster", "League City", "Leander", "Lewisville", "Liberty", "Little Elm", "Manor", "Mansfield", "Manvel", "Marshall", "Mckinney", "Melissa", "Mesquite", "Midlothian", "Mineral Wells", "Missouri City", "North Richland Hills", "Pasadena", "Pearland", "Pflugerville", "Plano", "Princeton", "Prosper", "Red Oak", "Richardson", "Richmond", "Roanoke", "Rockwall", "Rosenberg", "Round Rock", "Rowlett", "Royse City", "Sachse", "Sanger", "Santa Fe", "Seabrook", "Seagoville", "Sherman", "South Houston", "Southlake", "Spring", "Stafford", "Sugar Land", "Sulphur Springs", "Taylor", "Temple", "Terrell", "Texas City", "The Colony", "Tomball", "Waxahachie", "Weatherford", "Webster", "Woodway", "Wylie",
  
  // California cities
  "Alameda", "Alhambra", "Aliso Viejo", "Altadena", "Anaheim", "Antelope", "Antioch", "Arcadia", "Azusa", "Baldwin Park", "Bell Gardens", "Bellflower", "Belmont", "Benicia", "Berkeley", "Beverly Hills", "Brea", "Brentwood", "Buena Park", "Burbank", "Burlingame", "Camarillo", "Campbell", "Carlsbad", "Carmichael", "Carson", "Castro Valley", "Cerritos", "Chico", "Chino", "Chino Hills", "Chula Vista", "Citrus Heights", "Claremont", "Compton", "Concord", "Corona", "Costa Mesa", "Covina", "Culver City", "Cupertino", "Cypress", "Daly City", "Dana Point", "Danville", "Davis", "Diamond Bar", "Downey", "Dublin", "El Cajon", "El Cerrito", "El Dorado Hills", "El Monte", "Elk Grove", "Encinitas", "Escondido", "Fair Oaks", "Fairfield", "Fallbrook", "Folsom", "Fontana", "Fountain Valley", "Fremont", "Fresno", "Fullerton", "Galt", "Garden Grove", "Gardena", "Gilroy", "Glendale", "Glendora", "Hacienda Heights", "Hawthorne", "Hayward", "Hercules", "Hollister", "Huntington Beach", "Huntington Park", "Imperial Beach", "Inglewood", "Irvine", "Jurupa Valley", "La Habra", "La Mesa", "La Mirada", "La Puente", "La Verne", "Ladera Ranch", "Lafayette", "Laguna Hills", "Laguna Niguel", "Lake Forest", "Lakewood", "Lancaster", "Lathrop", "Lawndale", "Lemon Grove", "Lincoln", "Livermore", "Lodi", "Long Beach", "Los Altos", "Los Angeles", "Los Gatos", "Lynwood", "Manhattan Beach", "Manteca", "Martinez", "Maywood", "Menlo Park", "Milpitas", "Mission Viejo", "Modesto", "Monrovia", "Montclair", "Montebello", "Monterey", "Monterey Park", "Moorpark", "Morgan Hill", "Mountain View", "Napa", "National City", "Newark", "Newport Beach", "Norco", "North Highlands", "Norwalk", "Novato", "Oakland", "Oakley", "Oceanside", "Ontario", "Orange", "Orangevale", "Oxnard", "Pacifica", "Palmdale", "Palo Alto", "Paramount", "Pasadena", "Petaluma", "Pico Rivera", "Pittsburg", "Placentia", "Pleasant Hill", "Pleasanton", "Pomona", "Poway", "Rancho Cordova", "Rancho Cucamonga", "Rancho Palos Verdes", "Rancho Santa Margarita", "Redondo Beach", "Redwood City", "Rialto", "Richmond", "Riverbank", "Riverside", "Rocklin", "Rohnert Park", "Rosemead", "Roseville", "Rowland Heights", "Sacramento", "Salinas", "San Bernardino", "San Bruno", "San Carlos", "San Clemente", "San Diego", "San Dimas", "San Francisco", "San Gabriel", "San Jose", "San Juan Capistrano", "San Leandro", "San Lorenzo", "San Marcos", "San Mateo", "San Pablo", "San Rafael", "San Ramon", "Santa Ana", "Santa Clara", "Santa Clarita", "Santa Cruz", "Santa Monica", "Santa Paula", "Santa Rosa", "Santee", "Saratoga", "Seal Beach", "Seaside", "Simi Valley", "Soledad", "South Gate", "South Pasadena", "South San Francisco", "Spring Valley", "Stanton", "Stockton", "Suisun City", "Sunnyvale", "Temple City", "Thousand Oaks", "Torrance", "Tracy", "Tustin", "Union City", "Upland", "Vacaville", "Vallejo", "Vista", "Walnut", "Walnut Creek", "Watsonville", "West Covina", "West Hollywood", "West Sacramento", "Westminster", "Whittier", "Windsor", "Woodland", "Yorba Linda", "Yuba City"
];

// Read existing locations
const locationsPath = path.join(__dirname, '../src/data/locations.json');
const existingData = JSON.parse(fs.readFileSync(locationsPath, 'utf8'));

// Get existing location IDs to avoid duplicates
const existingIds = existingData.locations.map(loc => loc.id);

// Generate new locations
const newLocations = [];

allLocations.forEach(city => {
  // Create ID from city name
  const id = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  
  // Skip if already exists
  if (existingIds.includes(id)) {
    return;
  }

  // Determine state based on city
  const state = city === "California" ? "CA" : "TX";
  const stateName = state === "CA" ? "California" : "Texas";
  
  // Create location object
  const location = {
    id,
    name: city,
    state,
    fullName: `${city}, ${state}`,
    description: `Professional plumbing services in ${city}, ${state}. Licensed, experienced, and affordable for repairs, installs, or maintenance!`,
    phone: "(866) 289-1750",
    heroTitle: `Best Licensed & Certified Plumbers in ${city}`,
    heroSubtitle: `Call Us at (866) 289-1750! Trusted plumbing experts in ${city}, ${state}. Licensed, experienced, and affordable for repairs, installs, or maintenance!`,
    services: [
      {
        title: "Water Heaters Repair and Installation",
        description: `Expert repair and installation of water heaters for homes and businesses in ${city}, ${state}, ensuring efficient performance and long-term reliability.`,
        icon: "🔥"
      },
      {
        title: "Faucets & Sinks Repair & Replacement",
        description: `Installation and repair of faucets and sinks in ${city}, ${state}, ensuring leak-free performance and enhancing the functionality of your space.`,
        icon: "🚰"
      },
      {
        title: "Drain Cleaning",
        description: `Drain cleaning services for clogged pipes in ${city}, ${state}, ensuring smooth water flow and preventing blockages.`,
        icon: "🧹"
      },
      {
        title: "Toilet Repair",
        description: `Toilet repair and installation services in ${city}, ${state}, providing quick and reliable solutions for all toilet-related plumbing needs.`,
        icon: "🚽"
      }
    ],
    areas: [city],
    zipCodes: ["00000"],
    image: `/images/${id}.jpg`,
    meta: {
      title: `Best Licensed & Certified Plumbers in ${city}, ${state} | PlumPro`,
      description: `Trusted plumbing experts in ${city}, ${state}. Licensed, experienced, and affordable for repairs, installs, or maintenance! Call (866) 289-1750`
    },
    faqs: [
      {
        question: "How can I obtain a free quote?",
        answer: "You can get a free quote by calling us at (866) 289-1750 or filling out our online contact form. We'll provide you with a detailed estimate for your plumbing needs."
      },
      {
        question: "Do you offer emergency plumbing services?",
        answer: `Yes, we provide 24/7 emergency plumbing services in ${city}. Our team is always ready to respond to urgent plumbing issues.`
      }
    ],
    testimonials: [
      {
        name: "Local Customer",
        text: `Great service in ${city}! The team was professional and fixed our plumbing issue efficiently. Highly recommend!`,
        location: city
      }
    ]
  };

  newLocations.push(location);
});

// Add new locations to existing data
existingData.locations.push(...newLocations);

// Write back to file
fs.writeFileSync(locationsPath, JSON.stringify(existingData, null, 2));

console.log(`Added ${newLocations.length} new locations to the JSON file.`);
console.log('Total locations:', existingData.locations.length); 