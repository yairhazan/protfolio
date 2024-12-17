import { db } from './firebase';
import { doc, getDoc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  stocks?: {
    symbol: string;
    shares: number;
    purchasePrice: number;
  }[];
  investments?: {
    type: string;
    amount: number;
    date: string;
  }[];
  pension?: {
    provider: string;
    balance: number;
    contributions: number;
  };
}

export const createUserDocument = async (userData: Partial<UserData>) => {
  if (!userData.uid) throw new Error('User ID is required');

  try {
    const userRef = doc(db, 'users', userData.uid);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error;
  }
};

export const getUserData = async (uid: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

export const updateUserData = async (uid: string, data: Partial<UserData>) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

interface Stock {
  symbol: string;
  shares: number;
  purchasePrice: number;
}

export const addStock = async (userId: string, stock: Stock) => {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user document with stocks array
    await setDoc(userRef, {
      stocks: [
        {
          ...stock,
          addedAt: new Date().toISOString(),
        },
      ],
    });
  } else {
    // Add stock to existing user's stocks array
    await updateDoc(userRef, {
      stocks: arrayUnion({
        ...stock,
        addedAt: new Date().toISOString(),
      }),
    });
  }
};

export const addInvestment = async (uid: string, investmentData: UserData['investments'][0]) => {
  try {
    const userData = await getUserData(uid);
    if (!userData) throw new Error('User not found');

    const investments = userData.investments || [];
    investments.push(investmentData);

    await updateUserData(uid, { investments });
  } catch (error) {
    console.error('Error adding investment:', error);
    throw error;
  }
};

export const updatePension = async (uid: string, pensionData: UserData['pension']) => {
  try {
    await updateUserData(uid, { pension: pensionData });
  } catch (error) {
    console.error('Error updating pension:', error);
    throw error;
  }
}; 