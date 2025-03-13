export default function NoDeliveryToday() {
  return (
    <div className="table_section mt-5 font-inter w-full">
      <div className="flex flex-col">
        <div className="-m-1.5 overflow-x-auto">
          <div className="p-1.5 min-w-full inline-block align-middle">
            <div className="border rounded-lg divide-y divide-gray-200">
              <div className="py-5 px-4"></div>
              <div className="overflow-hidden">
                <p className="p-5 font-bold font-inter text-sm tracking-wider">
                  No delivery for today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
