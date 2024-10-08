"use server";
import { database } from "@/lib/database";
import { currentUser } from "@/lib/utils/currentUser";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import {
  DeleteAccountSchema,
  SetPasswordSchema,
  UpdateUserSchema,
} from "@/validations";
import { z } from "zod";
type UpdateUserImageProps = {
  image: string;
  path: string;
};
export async function updateUserImage(params: UpdateUserImageProps) {
  try {
    const { image, path } = params;

    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }

    const user = await database.user.findFirst({
      where: {
        email: userSession.email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await database.user.update({
      where: {
        id: user.id,
      },
      data: {
        image: image,
      },
    });

    userSession.image = image;

    revalidatePath(path);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateUserNameUser(
  values: z.infer<typeof UpdateUserSchema>,
  pathname: string,
) {
  try {
    const validatedFields = UpdateUserSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Something went wrong" };
    }
    const { name } = values;
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }

    const updatedUser = await database.user.update({
      where: {
        email: userSession.email!,
      },
      data: {
        name: name,
      },
    });

    if (!updatedUser) {
      return { error: "User not found" };
    }

    userSession.name = updatedUser.name;

    revalidatePath(pathname);

    return { success: "User updated" };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setNewPassword(values: z.infer<typeof SetPasswordSchema>,) {
  try {
     const validatedFields = SetPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Something went wrong" };
    }
    const { newPassword } = values;
    const user = await currentUser();
    if (!user) {
      return { error: "User Not Found" };
    }
    const dbUser = await database.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbUser) {
      return { error: "User Not Found" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await database.user.update({
      where: {
        email: dbUser.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    revalidatePath(path);

    return {
      success:
        "Password Created. Now you can login with your email and new password.",
    };
  } catch (error) {
    console.error(error);
    return { error: "Something Went Wrong" };
  }
}

export async function changePassword(values: z.infer<typeof SetPasswordSchema>) {
  try {
     const validatedFields = SetPasswordSchema.safeParse(values);
    if (!validatedFields.success) {
      return { error: "Something went wrong" };
    }
    const { oldPassword, newPassword } = values;
    if (!oldPassword) return { error: "Please enter your old password" };
     const user = await currentUser();
    if (!user) {
      return { error: "User Not Found" };
    }
    const dbUser = await database.user.findFirst({
      where: {
        email: user.email,
      },
    });

    if (!dbUser) {
      return { error: "User Not Found" };
    }

    const isMatch = await bcrypt.compare(oldPassword, dbUser.password!);
    if (!isMatch) {
      return { error: "Old password is incorrect" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await database.user.update({
      where: {
        email: dbUser.email,
      },
      data: {
        password: hashedPassword,
      },
    });

    revalidatePath(path);

    return { success: "Password Updated" };
  } catch (error) {
    console.error(error);
    return { error: "Something Went Wrong" };
  }
}
export async function deleteUser(values: z.infer<typeof DeleteAccountSchema) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return null;
    }
    
    const validatedFields = DeleteAccountSchema.safeParse(values);
    if (!validatedFields.success) {
      console.log(validatedFields);
      return { error: "Something went wrong" };
    }

    const { email, password } = values;
    
    const user = await prisma.user.findUnique({
      where: { email: userSession.email },
    });


    if (user.password) {
      const isMatch = await bcrypt.compare(password!, user.password);
      if (!isMatch) {
        return { error: "Password is incorrect" };
      }
      await prisma.user.delete({
        where: { email: user.email },
      });
    } else {
        if (!user || user.email !== email) {
        return { error: "Email does not exist in our database" };
        }
      await prisma.user.delete({
        where: { email },
      });
    }

    return { success: "User deleted successfully" };
  } catch (error) {
    console.log(error);
    return { error: "Something went wrong" };
  }
//[TwoFactorToggleServerAction]
