import { Alert } from "@heroui/alert";

import { client } from "~/api/orpc";
import AddPiece from "~/app/(dashboard)/repertoire/add-piece";
import RepertoireFilter from "~/app/(dashboard)/repertoire/filter";
import RepertoireGridItem from "~/app/(dashboard)/repertoire/grid-item";
import RepertoireList from "~/app/(dashboard)/repertoire/list";
import DashboardLayout from "~/components/dashboard-layout";

export default async function RepertoirePage() {
  const pieces = await client.repertoire.getPieces();

  return (
    <DashboardLayout title="Repertoire" actionNode={<AddPiece />}>
      {pieces.length > 0 ? (
        <RepertoireFilter
          listView={<RepertoireList pieces={pieces} />}
          gridView={
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-2">
              {pieces.map((piece) => (
                <RepertoireGridItem key={piece.id} {...piece} />
              ))}
            </div>
          }
        />
      ) : (
        <Alert
          color="primary"
          title={
            <p>
              Your repertoire is currently empty.
              <br />
              Click the <span className="font-bold">+ Add</span> button to get
              started.
            </p>
          }
        />
      )}
    </DashboardLayout>
  );
}
