import { Stack } from "expo-router";
import {Dukaprovider} from "@/app/context/DukaContext";

export default function RootLayout() {
  return(
      <Dukaprovider>
        <Stack screenOptions={{ headerShown: false }} />
      </Dukaprovider>
  );
}
