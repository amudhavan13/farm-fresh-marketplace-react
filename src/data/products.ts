
import { Product } from '../types';

export const products: Product[] = [
  {
    id: "1",
    name: "Tractor Cultivator",
    description: "Heavy-duty tractor cultivator with adjustable tines for efficient soil cultivation. This professional-grade cultivator is perfect for preparing seedbeds, controlling weeds, and aerating soil. Made from high-quality hardened steel, it's built to withstand years of use in the toughest farming conditions. Adjustable working width from 1.5m to 2.5m to suit different field sizes and tractor capacities. Compatible with most standard tractor hitch systems.",
    shortDescription: "Heavy-duty cultivator for efficient soil preparation",
    price: 12500,
    images: [
      "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
      "https://images.unsplash.com/photo-1589923188900-85597a35fc64",
      "https://images.unsplash.com/photo-1591880907925-e99cfd6e2652"
    ],
    category: "Soil Preparation",
    colors: ["Red", "Blue", "Green"],
    specifications: {
      "Width": "1.5-2.5m",
      "Weight": "350kg",
      "Material": "Hardened Steel",
      "Tines": "11",
      "Power Required": "40-80 HP"
    },
    stock: 15,
    reviews: [
      {
        id: "r1",
        userId: "u1",
        username: "Farmer_Kumar",
        rating: 4,
        comment: "Great cultivator! Has helped improve my field's soil quality significantly.",
        date: "2025-03-15"
      },
      {
        id: "r2",
        userId: "u2",
        username: "AgriExpert",
        rating: 5,
        comment: "Best cultivator I've used in 20 years of farming. Durable and efficient.",
        date: "2025-04-02"
      }
    ]
  },
  {
    id: "2",
    name: "Irrigation Sprinkler System",
    description: "Complete irrigation sprinkler system for efficient water distribution across fields. This advanced system provides even water coverage for up to 2 acres of crops. Features adjustable spray patterns, water-saving technology, and durable construction designed to withstand outdoor conditions. Easy to install with comprehensive instructions and all necessary components included. The system can be expanded with additional units for larger fields.",
    shortDescription: "Water-efficient sprinkler system for crops",
    price: 8700,
    images: [
      "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07",
      "https://images.unsplash.com/photo-1588260692213-59afb4322763",
      "https://images.unsplash.com/photo-1576678483955-6e5760765162"
    ],
    category: "Irrigation",
    colors: ["Blue", "Black"],
    specifications: {
      "Coverage": "Up to 2 acres",
      "Water Pressure": "30-70 PSI",
      "Material": "UV-resistant PVC",
      "Spray Distance": "5-15m",
      "Adjustable": "Yes"
    },
    stock: 23,
    reviews: [
      {
        id: "r3",
        userId: "u3",
        username: "CropMaster",
        rating: 5,
        comment: "Transformed my irrigation process. Much more efficient water usage now.",
        date: "2025-04-10"
      }
    ]
  },
  {
    id: "3",
    name: "Seed Drill",
    description: "Precision seed drill for accurate seed placement and spacing. This professional seed drill ensures optimal germination rates by placing seeds at the perfect depth with consistent spacing. Features adjustable row spacing to accommodate various crop types and planting patterns. The large hopper capacity reduces refill time, allowing you to cover more ground efficiently. Compatible with most compact and mid-size tractors.",
    shortDescription: "Precision planting for higher germination rates",
    price: 35000,
    images: [
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
      "https://images.unsplash.com/photo-1464519046765-f6d70b82a0df",
      "https://images.unsplash.com/photo-1596489295439-e30ecc61ecc4"
    ],
    category: "Planting",
    colors: ["Red", "Yellow"],
    specifications: {
      "Rows": "6",
      "Row Spacing": "20-40cm",
      "Hopper Capacity": "120kg",
      "Working Width": "2.4m",
      "Power Required": "35-70 HP"
    },
    stock: 7,
    reviews: [
      {
        id: "r4",
        userId: "u4",
        username: "HarvestPro",
        rating: 4,
        comment: "Excellent precision. Reduced my seed usage by almost 20%.",
        date: "2025-03-28"
      },
      {
        id: "r5",
        userId: "u5",
        username: "FarmTech",
        rating: 5,
        comment: "Worth every rupee! My crop rows are perfectly straight now.",
        date: "2025-04-05"
      }
    ]
  },
  {
    id: "4",
    name: "Fertilizer Spreader",
    description: "High-capacity fertilizer spreader for even distribution across fields. This professional-grade spreader provides consistent coverage for optimal crop nutrition. The adjustable spreading width allows for precise application in various field sizes and conditions. Built with corrosion-resistant materials to handle all types of fertilizers. Features easy calibration controls and a flow-rate adjustment system for accurate application rates.",
    shortDescription: "Even distribution for optimal crop nutrition",
    price: 18900,
    images: [
      "https://images.unsplash.com/photo-1472396961693-142e6e269027",
      "https://images.unsplash.com/photo-1559179833-9b07537454bc",
      "https://images.unsplash.com/photo-1532074534361-bb09a38cf917"
    ],
    category: "Fertilization",
    colors: ["Green", "Orange"],
    specifications: {
      "Capacity": "500L",
      "Spread Width": "6-14m",
      "Material": "Stainless Steel/Polymer",
      "Flow Control": "Adjustable",
      "Mounting": "3-point hitch"
    },
    stock: 12,
    reviews: [
      {
        id: "r6",
        userId: "u6",
        username: "GreenFielder",
        rating: 5,
        comment: "Excellent distribution pattern. My fields have never looked more evenly fertilized.",
        date: "2025-04-08"
      }
    ]
  },
  {
    id: "5",
    name: "Rotary Tiller",
    description: "Powerful rotary tiller for efficient soil preparation and weed control. This heavy-duty tiller thoroughly pulverizes soil to create the perfect seedbed for planting. The heat-treated tines are designed for durability and effectiveness in breaking up compacted soil. Adjustable working depth allows for shallow cultivation or deep tillage as needed. Side shields prevent soil throw and protect crops during operation.",
    shortDescription: "Powerful tiller for perfect seedbed preparation",
    price: 27500,
    images: [
      "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
      "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9",
      "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2"
    ],
    category: "Soil Preparation",
    colors: ["Red", "Black"],
    specifications: {
      "Working Width": "1.8m",
      "Tilling Depth": "5-25cm",
      "PTO Speed": "540 RPM",
      "Blades": "42",
      "Power Required": "45-90 HP"
    },
    stock: 9,
    reviews: [
      {
        id: "r7",
        userId: "u7",
        username: "SoilMaster",
        rating: 4,
        comment: "Makes quick work of tough soil. Very satisfied with the results.",
        date: "2025-03-20"
      },
      {
        id: "r8",
        userId: "u1",
        username: "Farmer_Kumar",
        rating: 5,
        comment: "Built like a tank! Handles my rocky field without any issues.",
        date: "2025-04-12"
      }
    ]
  },
  {
    id: "6",
    name: "Grain Moisture Meter",
    description: "Digital grain moisture meter for accurate moisture content measurement. This essential tool helps farmers determine the optimal harvest time and storage conditions for their crops. Features quick measurement with high accuracy across a wide range of grains and seeds. The digital display provides clear readings with automatic temperature compensation for reliable results in any environment. Compact and portable design with long battery life for field use.",
    shortDescription: "Digital meter for precise moisture measurement",
    price: 4500,
    images: [
      "https://images.unsplash.com/photo-1526060226885-bfbc4d789a9d",
      "https://images.unsplash.com/photo-1622434641406-a158123450f9",
      "https://images.unsplash.com/photo-1607240580828-af248bc249ba"
    ],
    category: "Testing Equipment",
    colors: ["Gray", "Yellow"],
    specifications: {
      "Accuracy": "±0.5%",
      "Measurement Range": "5-40%",
      "Grain Types": "16 presets",
      "Display": "LCD Digital",
      "Power": "4 AAA Batteries"
    },
    stock: 35,
    reviews: [
      {
        id: "r9",
        userId: "u2",
        username: "AgriExpert",
        rating: 5,
        comment: "Extremely accurate and easy to use. A must-have tool for serious farmers.",
        date: "2025-03-25"
      }
    ]
  },
  {
    id: "7",
    name: "Paddy Harvester",
    description: "Efficient paddy harvester for quick and clean rice harvesting. This specialized harvester is designed specifically for rice fields, with gentle handling to minimize grain damage and loss. Features adjustable cutting height and excellent flotation for operation in wet field conditions. The high-capacity grain tank reduces downtime between unloading. Economical fuel consumption helps keep operating costs low while maintaining high productivity.",
    shortDescription: "Specialized harvester for efficient rice collection",
    price: 175000,
    images: [
      "https://images.unsplash.com/photo-1625246333195-78d73c0b7e43",
      "https://images.unsplash.com/photo-1595872913423-78769e5a8947",
      "https://images.unsplash.com/photo-1591290471258-8a2d85a09e7a"
    ],
    category: "Harvesting",
    colors: ["Yellow", "Green"],
    specifications: {
      "Cutting Width": "2.0m",
      "Grain Tank": "1500kg",
      "Engine": "75HP Diesel",
      "Threshing System": "Axial Flow",
      "Fuel Capacity": "80L"
    },
    stock: 3,
    reviews: [
      {
        id: "r10",
        userId: "u3",
        username: "CropMaster",
        rating: 4,
        comment: "Transformed our harvest season. Much faster than our old methods.",
        date: "2025-04-01"
      },
      {
        id: "r11",
        userId: "u5",
        username: "FarmTech",
        rating: 5,
        comment: "Excellent design for Indian field conditions. Very low grain loss.",
        date: "2025-04-11"
      }
    ]
  },
  {
    id: "8",
    name: "Solar Water Pump",
    description: "Eco-friendly solar powered water pump for irrigation needs. This sustainable solution reduces operating costs while providing reliable water supply for irrigation. The high-efficiency solar panels generate power even in partially cloudy conditions. Features automatic operation with built-in protection against dry running and overheating. The maintenance-free brushless motor ensures long service life with minimal upkeep required.",
    shortDescription: "Clean energy solution for reliable irrigation",
    price: 65000,
    images: [
      "https://images.unsplash.com/photo-1595438296644-eab2fe18eab4",
      "https://images.unsplash.com/photo-1575493035843-9560639476c6",
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5"
    ],
    category: "Irrigation",
    colors: ["Blue", "Black"],
    specifications: {
      "Solar Panel": "1000W",
      "Max Flow Rate": "10000L/hour",
      "Max Head": "50m",
      "Panel Type": "Monocrystalline",
      "Pump Type": "Submersible"
    },
    stock: 6,
    reviews: [
      {
        id: "r12",
        userId: "u4",
        username: "HarvestPro",
        rating: 5,
        comment: "Completely eliminated my electricity costs for irrigation. Works perfectly.",
        date: "2025-03-22"
      }
    ]
  }
];
