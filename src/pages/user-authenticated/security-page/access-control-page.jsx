// components
import Heading from "@/components/header/page-heading";
import ScannedGatePass from "@/components/security-components/scanned-gatepass";
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
