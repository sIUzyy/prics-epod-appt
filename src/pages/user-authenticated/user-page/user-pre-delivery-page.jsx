// ---- components ----
import ScanItems from "@/components/user-components/scan-items";
import ScannedItems from "@/components/user-components/scanned-items";
import Heading from "@/components/header/page-heading";

export default function UserPreDeliveryPage() {
  return (
    <div className="my-5 mx-4">
      <Heading
        title={"Pre Delivery"}
        description={`Scan the barcode of the item to begin the pre-delivery process.`}
      />

      <div className="lg:flex 2xl:gap-x-5">
        {/*scan items - camera */}
        <ScanItems />

        {/*scanned items - inputs form */}
        <ScannedItems />
      </div>
    </div>
  );
}
