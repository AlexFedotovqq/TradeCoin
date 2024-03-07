import { fetcher } from "@/utils/fetcher";

export const fetchPoolsPage = async (id) => {
  try {
    return await fetcher(`/api/pools/page/${id}`);
  } catch (error) {
    console.error("Error fetching token:", error);
    throw error;
  }
};
