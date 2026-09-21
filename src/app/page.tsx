import AppShell from "@/components/AppShell";
import { AdhanProvider } from "@/components/AdhanContext";

export default function Home() {
  return (
    <AdhanProvider>
      <AppShell />
    </AdhanProvider>
  );
}
