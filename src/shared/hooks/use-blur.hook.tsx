import { useEffect, useState } from "react";

export const useBlur = () => {
  const [isBlurred, setBlurred] = useState<boolean>(false);

  const handleBlur = (blur: boolean) => {
    return () => {
      setBlurred(blur);
    };
  };

  useEffect(() => {
    const onBlur = handleBlur(true);
    const onFocus = handleBlur(false);

    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  });

  return { isBlurred };
};
