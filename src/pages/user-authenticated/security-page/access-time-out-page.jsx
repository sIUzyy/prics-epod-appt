// components
import Heading from "@/components/header/page-heading";
import ScannedTimeOut from "@/components/security-components/scanned-time-out";

export default function SecurityTimeOut() {
  return (
    <div className="m-5">
      <Heading
        title={"Time Out"}
        description={`Click the button to scan the driver's barcode for gate pass.`}
      />
      <div className="max-w-[350px]">
        <ScannedTimeOut />
      </div>
    </div>
  );
}
