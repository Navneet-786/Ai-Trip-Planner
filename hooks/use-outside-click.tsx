// import React, { useEffect } from "react";

// export const useOutsideClick = (
//   ref: React.RefObject<HTMLDivElement>,
//   callback: Function
// ) => {
//   useEffect(() => {
//     const listener = (event: any) => {
//       // DO NOTHING if the element being clicked is the target element or their children
//       if (!ref.current || ref.current.contains(event.target)) {
//         return;
//       }
//       callback(event);
//     };

//     document.addEventListener("mousedown", listener);
//     document.addEventListener("touchstart", listener);

//     return () => {
//       document.removeEventListener("mousedown", listener);
//       document.removeEventListener("touchstart", listener);
//     };
//   }, [ref, callback]);
// };


import { RefObject, useEffect } from "react";

export function useOutsideClick<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void
) {
  useEffect(() => {
    function listener(event: MouseEvent | TouchEvent) {
      if (!ref.current) return;

      if (ref.current.contains(event.target as Node)) return;

      handler();
    }

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}
