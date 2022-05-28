import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import { State } from "../../redux/Types/State";
import { actions } from "../../redux/store";

export const useLoading = () => {
  const isLoading = useSelector<State, boolean>((state) => state.isLoading);
  const dispatch = useDispatch();

  return useCallback(
    (isLoading: boolean, fullscreen?: boolean) => {
      if (isLoading && fullscreen) {
        dispatch(actions.setLoading(true));
      }

      if (isLoading && !fullscreen) {
        document.body.classList.add("loading");
      }

      if (!isLoading) {
        dispatch(actions.setLoading(false));
        document.body.classList.remove("loading");
      }
    },
    [isLoading]
  );
};
