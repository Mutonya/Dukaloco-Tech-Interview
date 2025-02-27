import { Stack } from "expo-router";
import {Dukaprovider} from "@/app/context/DukaContext";
import {ToastProvider} from "@/app/components/ToastContext";

export default function RootLayout() {
  return(

      <ToastProvider>
          <Dukaprovider>
        <Stack screenOptions={{ headerShown: false }} />
      </Dukaprovider>
      </ToastProvider>
  );
}
