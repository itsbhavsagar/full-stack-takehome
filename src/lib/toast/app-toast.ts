import { toast } from "sonner";
import { TOAST_COPY } from "@/lib/constants/toast";

export const appToast = {
  profileSaved: () => toast.success(TOAST_COPY.profileSaved),

  bulkAccepted: (count: number) => {
    if (count > 0) {
      toast.success(TOAST_COPY.bulkAccepted(count));
    }
  },

  buildFailed: () => toast.error(TOAST_COPY.buildFailed),

  saveFailed: () => toast.error(TOAST_COPY.saveFailed),

  bulkAcceptFailed: () => toast.error(TOAST_COPY.bulkAcceptFailed),

  fieldUpdateFailed: () => toast.error(TOAST_COPY.fieldUpdateFailed),
};

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
