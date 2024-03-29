import { fetcher } from "@/utils/fetcher";

export const fetchTokensPage = async (id) => {
  try {
    return await fetcher(`/api/tokens/page/${id}`);
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};
