
let generateCongruencialLinealNumbers = ({seed, multiplier, additive, modulus}) => {
  const multiplicative = [];
  const residues = [];
  const r = [];

  let x = seed;

  for (let i = 0; i < modulus - 1; i++) {
    const a_aux = (x * multiplier) + additive;
    x = a_aux % modulus;
    const equivalent = x / modulus;

    multiplicative.push(a_aux);
    residues.push(x);
    r.push(parseFloat(equivalent.toFixed(10)));
  }

  return {
    table: {
      column1: { name: "Multiplicativo", data: multiplicative },
      column2: { name: "Residuos", data: residues },
      column3: { name: "r", data: r }
    },
    nums: r,
  };
};

// Inicializamos la lista de números y un índice para llevar el control
const generatedNumbers = generateCongruencialLinealNumbers({  
  seed: 122,
  multiplier:223,
  additive:881, 
  modulus:997}).nums;

let currentIndex = 0;

export function random() {
  // Tomamos el número en el índice actual
  const number = generatedNumbers[currentIndex];
  // Avanzamos el índice y lo reiniciamos si llegamos al final de la lista
  currentIndex = (currentIndex + 1) % generatedNumbers.length;
  return number;
}

const generateUniformProbabilitiesDistribution = (nums) => {

  const probabilities = [0,0.25,0.5,1];
  // Generar números aleatorios uniformes entre 0 y 1
  const xValues = nums;
  const generatedNumbers = xValues.map((num) => {
    const rand = num;
    return probabilities.findIndex(p => rand <= p);
  });

  return generatedNumbers
};
