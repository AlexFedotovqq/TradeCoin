import { useQuery } from "@tanstack/react-query";

import { fetchPoolsPage } from "./queries";

export const usePoolsPage = (id) => {
  return useQuery({
    queryKey: [id],
    queryFn: () => fetchPoolsPage(id),
  });
};
