import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";

import { cn } from "@/lib/utils";

<<<<<<< HEAD
/**
 * Yoqish / o'chirish tugmasi (qora-oq uslub).
 * - O'chiq: kulrang cho'zinchoq tugma, yumaloq tutqich chapda.
 * - Yoqiq: oq fon, qora tutqich o'ngda.
 * - Bosilganda tutqich biroz cho'ziladi, so'ng yumshoq "prujina" bilan joyiga o'tadi.
 */
=======
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
<<<<<<< HEAD
      "group peer relative inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border p-[3px]",
      "transition-[background-color,border-color,box-shadow] duration-300 ease-out",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[state=unchecked]:border-white/15 data-[state=unchecked]:bg-white/10 data-[state=unchecked]:shadow-[inset_0_1px_4px_rgba(0,0,0,0.65)]",
      "data-[state=unchecked]:hover:bg-white/15",
      "data-[state=checked]:border-white data-[state=checked]:bg-white data-[state=checked]:shadow-[0_0_18px_rgba(255,255,255,0.25)]",
=======
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
      className,
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
<<<<<<< HEAD
        "pointer-events-none block h-5 w-5 rounded-full",
        "transition-[transform,width,background-color,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
        "data-[state=unchecked]:translate-x-0 data-[state=unchecked]:bg-neutral-300 data-[state=unchecked]:shadow-[0_2px_6px_rgba(0,0,0,0.6)]",
        "data-[state=checked]:translate-x-5 data-[state=checked]:bg-black data-[state=checked]:shadow-[0_2px_6px_rgba(0,0,0,0.35)]",
        // bosib turganda tutqich biroz cho'ziladi
        "group-active:w-6 group-active:data-[state=checked]:translate-x-4",
        "motion-reduce:transition-none",
=======
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
>>>>>>> 6daf45bd9c7f394adad735bf241b3ff781303b7a
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
