import { media } from "./media";

export const PRICE = "$199";

export const recipes = [
  {
    id: "ramen",
    title: "Spicy Miso Ramen",
    time: "45 min",
    level: "Expert",
    match: "98% Match",
    image: media.ramen,
    picked: true,
  },
  {
    id: "pasta",
    title: "Truffle Pasta",
    time: "20 min",
    level: "Intermediate",
    match: "85% Match",
    image: media.pasta,
    picked: true,
  },
  {
    id: "toast",
    title: "Avocado Toast",
    time: "10 min",
    level: "Easy",
    match: "72% Match",
    image: media.toast,
    picked: true,
  },
  {
    id: "risotto",
    title: "Golden Risotto",
    time: "30 min",
    level: "Intermediate",
    match: "",
    image: media.risotto,
    picked: false,
  },
  {
    id: "burger",
    title: "Classic Burger",
    time: "25 min",
    level: "Easy",
    match: "",
    image: media.burger,
    picked: false,
  },
  {
    id: "salad",
    title: "Super Green Salad",
    time: "15 min",
    level: "Easy",
    match: "",
    image: media.salad,
    picked: false,
  },
  {
    id: "curry",
    title: "Spicy Chicken Curry",
    time: "50 min",
    level: "Hard",
    match: "",
    image: media.curry,
    picked: false,
  },
] as const;

export type RecipeId = (typeof recipes)[number]["id"];

export const steakSteps = [
  {
    title: "Clear the station",
    action: "Clear a dry space beside the burner, Chef.",
    detail: "Tell me when the counter is clear.",
    insight: "We start with the station. One check, then we move.",
  },
  {
    title: "Hands and towel",
    action: "Wash your hands, then set a dry towel by the board.",
    detail: "Tell me when that is done.",
    insight: "Dry hands hold a pan. Wet hands slip.",
  },
  {
    title: "Heat the pan",
    action: "Set the pan on medium-high and add a thin coat of oil.",
    detail: "Leave it there. Tell me what the oil looks like.",
    insight: "Look for a shimmer across the oil. Tell me when you see it.",
  },
  {
    title: "Searing the Steak",
    action: "Place the steak in the hot pan.",
    detail: "Lay it away from you so the oil does not splash. Then stop.",
    insight: "Wait for the oil to shimmer before the meat goes in. That is how you build a crust.",
  },
  {
    title: "Hands off",
    action: "Leave the steak alone.",
    detail: "Tell me when three minutes have passed.",
    insight: "Moving it now tears the crust. Wait, then tell me the time.",
  },
  {
    title: "Check your side",
    action: "Lift one edge and tell me the color you see.",
    detail: "I will not call it done from here. You are my eyes.",
    insight: "Tell me what you see, Chef. Deep brown is the cue to turn it.",
  },
  {
    title: "Turn once",
    action: "Turn the steak once, away from you.",
    detail: "Then leave it. Tell me when it is down.",
    insight: "One turn. No pressing.",
  },
  {
    title: "Second side",
    action: "Leave the second side untouched.",
    detail: "Tell me when three minutes are up.",
    insight: "Same rule. Hands off until you call the time.",
  },
  {
    title: "Temperature check",
    action: "Take the temperature in the center and read it to me.",
    detail: "Do not guess from color alone.",
    insight: "Your thermometer is the check. Tell me the number.",
  },
  {
    title: "Rest the steak",
    action: "Move the steak to a warm plate.",
    detail: "Tell me when it is off the heat.",
    insight: "Rest comes next. We do not slice yet.",
  },
  {
    title: "Rest timer",
    action: "Leave it to rest.",
    detail: "Tell me when five minutes have passed.",
    insight: "Resting keeps the juices in the meat. Wait for your timer.",
  },
  {
    title: "Slice",
    action: "Slice across the grain, one slice.",
    detail: "Show yourself the inside, then tell me what you see.",
    insight: "One slice. Then tell me the color in the center.",
  },
] as const;

export const modules = [
  {
    week: "Week 1: Mise en Place",
    detail: "Precision cutting, knife maintenance, and kitchen organization.",
    state: "done" as const,
  },
  {
    week: "Week 2: Stocks & Sauces",
    detail: "Grand sauces and clear broths, the base of the cooking.",
    state: "done" as const,
  },
  {
    week: "Week 3: Dry Heat Methods",
    detail: "Roasting, grilling, and sautéing proteins.",
    state: "done" as const,
  },
  {
    week: "Week 4: Moist Heat",
    detail: "Poaching, steaming, and braising. Lesson 2 of 5.",
    state: "active" as const,
  },
  {
    week: "Week 5: Vegetables & Herbs",
    detail: "Selecting, storing, and preparing seasonal produce.",
    state: "locked" as const,
  },
  {
    week: "Week 6: Eggs & Dairy",
    detail: "Omelets, custards, and cheese.",
    state: "locked" as const,
  },
];

export const curriculum = [
  {
    icon: "content_cut",
    title: "Foundation & Knife Skills",
    weeks: "Weeks 1–4",
    detail: "Claw grip, essential cuts, and a clean mise en place.",
  },
  {
    icon: "soup_kitchen",
    title: "The Saucier",
    weeks: "Weeks 5–8",
    detail: "Mother sauces, stocks, and reductions.",
  },
  {
    icon: "skillet",
    title: "Proteins & Heat",
    weeks: "Weeks 9–12",
    detail: "Butchery basics, searing, roasting, and gentle heat.",
  },
  {
    icon: "cake",
    title: "Plating & Pastry",
    weeks: "Weeks 13–16",
    detail: "Composition, doughs, and chocolate work.",
  },
];

export const quiz = [
  {
    prompt: "Before the first cut, what do you confirm?",
    options: ["The board is wet", "The station is clear and the towel is dry", "The oven is on broil"],
    answer: 1,
  },
  {
    prompt: "The claw grip keeps fingers safe by…",
    options: ["Curling fingertips under", "Pointing fingers at the blade", "Holding the food in the air"],
    answer: 0,
  },
  {
    prompt: "A julienne stick in this lesson is about…",
    options: ["3 mm × 3 mm × 5 cm", "1 inch cubes", "Paper-thin sheets"],
    answer: 0,
  },
  {
    prompt: "If the board slides, you…",
    options: ["Cut faster", "Stop and reset the damp towel", "Lift the board while cutting"],
    answer: 1,
  },
  {
    prompt: "Cap can judge doneness from the camera.",
    options: ["Yes, the frame is enough", "No. Tell Cap what you see and the temperature"],
    answer: 1,
  },
];
