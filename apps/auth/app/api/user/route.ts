import { getdbUser } from "@/actions/auth.actions";
import { currentUser } from "@/lib/utils/currentUser";

export const GET = async () => {
  try {
    const user = await currentUser();
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }
    const dbUser = await getdbUser();
    return new Response(JSON.stringify(dbUser), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
};
