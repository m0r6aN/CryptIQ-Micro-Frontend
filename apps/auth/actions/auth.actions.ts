"use server"
//[imports]
 import { database } from "@/lib/database";
import { currentUser } from "@/lib/utils/currentUser";
import { AuthError } from "next-auth";
 
//[CredentialsBase] 
 
export async function GetUserById(id: string) {
  try {
    const user = await database.user.findUnique({
      where: {
        id: id,
      },
    });
    if (!user) {
      return { error: "User not found" };
    }
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching user by ID");
  }
} 
 export async function GetUserByEmail(email: string) {
  try {
    const user = await database.user.findFirst({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error(error);
    throw new Error("An error occurred while fetching user by email");
  }
}
 export async function getdbUser() {
  try {
    // Retrieve the current user session
    const sessionUser = await currentUser(); // Assuming you have a function to retrieve the current user session

    if (!sessionUser) {
      return { error: 'User not found' };
    }

    // Find the user by email
    const user = await database.user.findFirst({
      where: {
        email: sessionUser.email,
      },
    });

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error(error);
    throw error;
  }
} 