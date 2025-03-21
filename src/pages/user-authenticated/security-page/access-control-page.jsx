// ---- components ----
import ScannedGatePass from "@/components/security-components/scanned-gatepass";
import Heading from "@/components/header/page-heading";

// ---- note: currently abandoned, this page is combination of time-in/time-out
export default function SecurityDashboardPage() {
  return (
    <div className="m-5">
      <Heading
        title={"dashboard"}
        description={`Click the button to scan the driver's barcode for gate pass purposes.`}
      />

      <div className="max-w-[350px]">
        <ScannedGatePass />
      </div>
    </div>
  );
}
