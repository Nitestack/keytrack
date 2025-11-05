import { Spinner } from "@heroui/spinner";

export default function Loading() {
  return (
    <div className="flex flex-1 flex-col justify-center gap-4">
      <Spinner size="lg" color="primary" />
      <div className="text-center">
        <h3 className="text-lg font-semibold text-default-900">Loading</h3>
        <p className="text-sm text-default-500">Please wait...</p>
      </div>
    </div>
  );
}
