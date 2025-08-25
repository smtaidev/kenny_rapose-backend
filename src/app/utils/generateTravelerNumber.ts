
export const generateTravelerNumber = (): string => {
  // Generate random letters (A-Z)
  const generateLetter = (): string => {
    return String.fromCharCode(65 + Math.floor(Math.random() * 26));
  };

  // Generate random digits (0-9)
  const generateDigit = (): string => {
    return Math.floor(Math.random() * 10).toString();
  };

  // Generate 8 characters with random mix of letters and numbers
  let travelerNumber = '';
  for (let i = 0; i < 8; i++) {
    // 50% chance for letter, 50% chance for digit
    if (Math.random() < 0.5) {
      travelerNumber += generateLetter();
    } else {
      travelerNumber += generateDigit();
    }
  }

  return travelerNumber;
};

/**
 * Generates a unique traveler number and ensures it's unique in the database
 * This function should be called during user registration
 */
export const generateUniqueTravelerNumber = async (prisma: any): Promise<string> => {
  let travelerNumber: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    travelerNumber = generateTravelerNumber();
    
    // Check if this traveler number already exists
    const existingUser = await prisma.user.findUnique({
      where: { travelerNumber }
    });

    if (!existingUser) {
      isUnique = true;
    } else {
      attempts++;
    }
  }

  if (!isUnique) {
    throw new Error('Unable to generate unique traveler number after multiple attempts');
  }

  return travelerNumber!;
};
